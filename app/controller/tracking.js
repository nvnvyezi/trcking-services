const { Controller } = require('egg')

const trackingGetRule = {
  type: { type: 'string', format: /(normal|kernel)/, required: false },
  // demand: { type: 'string', min: 0, max: 30, required: false },
  event: { type: 'string', format: /\w{1,20}/, required: false },
  // principalPM: { type: 'string', min: 0, max: 20, required: false },
  version: {
    type: 'string',
    required: false,
    format: /^(\d{1,2}\.){2}\d{1,2}$/,
  },
  status: { type: 'number', min: 0, max: 5, required: false },
  demand: { type: 'string', min: 0, max: 30, required: false },
  system: {
    type: 'string',
    required: false,
    format: /(android|ios|web|servers)/,
  },
}

const trackingPostRule = {
  params: { type: 'array', required: false },
  demand: { type: 'string', min: 0, max: 30 },
  event: { type: 'string', format: /^\w{1,40}$/ },
  describe: { type: 'string', min: 0, max: 100 },
  principalPM: { type: 'string', min: 0, max: 20 },
  type: { type: 'string', format: /(normal|kernel)/ },
  version: { type: 'string', format: /^(\d{1,2}\.){2}\d{1,2}$/ },
  system: { type: 'string', format: /(android|ios|web|server)/ },
  principalFE: { type: 'string', min: 0, max: 20, required: false },
  principalQA: { type: 'string', min: 0, max: 20, required: false },
  principalRD: { type: 'string', min: 0, max: 20, required: false },
  principalIos: { type: 'string', min: 0, max: 20, required: false },
  principalAndroid: { type: 'string', min: 0, max: 20, required: false },
}

const trackingPathStatusRule = {
  demand: { type: 'string', min: 0, max: 30 },
  status: { type: 'number', min: 0, max: 5 },
}

const trackingBatchRule = {
  demand: { type: 'string' },
  status: { type: 'number', min: 0, max: 5 },
}

const trackingPatchRule = {
  ...trackingPostRule,
  ...trackingPathStatusRule,
}

const trackingDelRule = {
  demand: { type: 'string', min: 0, max: 30 },
}

class Tracking extends Controller {
  async get() {
    const { ctx, service } = this
    const { query } = ctx.request
    const { skip, limit, type, system, status, demand, event, version } = query
    const errors = await ctx.validate(trackingGetRule, query)

    if (errors) {
      ctx.status = 422
      ctx.body = ctx.responseBody(false, { errors })
      return
    }

    const querys = {
      event: { $regex: new RegExp(event) },
      demand: { $regex: new RegExp(demand) },
    }

    if (type) {
      querys.type = type
    }
    if (status) {
      querys.status = Number(status)
    }
    if (system) {
      querys.system = system
    }
    if (version) {
      querys.version = version
    }

    const findRes = await service.tracking.find(querys, skip, limit)
    ctx.body = ctx.responseBody(true, { data: findRes })
  }

  async getAllVersion() {
    const { ctx, service } = this
    const findRes = await service.tracking.findAllVersion()
    ctx.body = ctx.responseBody(true, { data: findRes })
  }

  async getAllDemand() {
    const { ctx, service } = this
    const findRes = await service.tracking.findAllDemand()
    ctx.body = ctx.responseBody(true, { data: findRes })
  }

  async update() {
    const { ctx, service } = this
    const { body } = ctx.request

    const errors = await ctx.validate(trackingPatchRule, body)

    if (errors) {
      ctx.status = 422
      ctx.body = ctx.responseBody(false, { errors })
      return
    }

    const { demand, ...params } = body
    const updateRes = await service.tracking.update({ demand }, params)
    if (updateRes.ok === 1) {
      ctx.body = ctx.responseBody(true, { data: 'ok' })
      return
    }

    ctx.status = 500
    ctx.body = ctx.responseBody(false, { data: '修改失败' })
  }

  async updateStatus() {
    const { ctx, service } = this
    const { body } = ctx.request

    const errors = await ctx.validate(trackingPathStatusRule, body)

    if (errors) {
      ctx.status = 422
      ctx.body = ctx.responseBody(false, { errors })
      return
    }

    const { demand, status } = body
    const updateRes = await service.tracking.updateStatus(
      { demand },
      { status },
      { multi: false },
    )
    if (updateRes.ok === 1) {
      ctx.body = ctx.responseBody(true, { data: 'ok' })
      return
    }

    ctx.status = 500
    ctx.body = ctx.responseBody(false, { data: '修改失败' })
  }

  async updateBatchStatus() {
    const { ctx, service } = this
    const { body } = ctx.request

    const errors = await ctx.validate(trackingBatchRule, body)

    if (errors) {
      ctx.status = 422
      ctx.body = ctx.responseBody(false, { errors })
      return
    }

    const { demand, status } = body
    const demands = demand.split(',')

    const updateRes = await service.tracking.updateStatus(
      { demand: { $in: demands } },
      { status },
      { multi: true },
    )
    if (updateRes.ok === 1) {
      ctx.body = ctx.responseBody(true, { data: 'ok' })
      return
    }

    ctx.status = 500
    ctx.body = ctx.responseBody(false, { data: '修改失败' })
  }

  async delete() {
    const { ctx, service } = this
    const { body } = ctx.request

    const errors = await ctx.validate(trackingDelRule, body)

    if (errors) {
      ctx.status = 422
      ctx.body = ctx.responseBody(false, { errors })
      return
    }

    const delRes = await service.tracking.delete({ demand: body.demand })

    if (delRes.deletedCount === 0) {
      ctx.status = 204
      ctx.body = ctx.responseBody(false)
      return
    }

    ctx.body = ctx.responseBody(true, { data: 'ok' })
  }

  async create() {
    const { ctx, service } = this
    const { body } = ctx.request

    const errors = await ctx.validate(trackingPostRule, body)

    if (errors) {
      ctx.status = 422
      ctx.body = ctx.responseBody(false, { errors })
      return
    }

    const findRes = await service.tracking.find({
      demand: body.demand,
      event: body.event,
    })

    if (findRes.total) {
      ctx.status = 403
      ctx.body = ctx.responseBody(false, { msg: '埋点已存在' })
      return
    }

    // 处理params
    const { params } = body
    let handleParams = []

    try {
      handleParams = params.map(async param => {
        const parseParam = JSON.parse(param) || {
          name: 'test',
          type: 'boolean',
          describe: '这是一个测试',
        }

        const { total } = await service.attribute.find({
          name: parseParam.name,
        })
        if (!total) {
          await service.attribute.insert({
            name: parseParam.name,
            type: parseParam.type,
            describe: parseParam.describe,
            creator: body.principalPM,
          })
        }
        return parseParam
      })

      handleParams = await Promise.all(handleParams)
    } catch (error) {
      ctx.status = 498
      ctx.body = ctx.responseBody(false, {
        msg: '同步更新属性失败，请稍后重新创建',
      })
      return
    }

    const insertResult = await service.tracking.insert({
      ...body,
      params: handleParams,
    })

    if (insertResult) {
      ctx.body = ctx.responseBody(true, { data: '埋点创建成功' })
      return
    }
    ctx.body = ctx.responseBody(false, { msg: '创建埋点失败，请稍后重试' })
  }
}

module.exports = Tracking
