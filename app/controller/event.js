const { Controller } = require('egg')

const eventGetRule = {
  event: { type: 'string', format: /^\w{1,40}$/, required: false },
  system: {
    type: 'string',
    required: false,
    format: /(android|ios|web|server)/,
  },
  demand: { type: 'string', min: 0, max: 30, required: false },
  deviceId: { type: 'string', required: false },
}

const eventPostRule = {
  event: { type: 'string', format: /^\w{1,40}$/ },
  url: {
    type: 'string',
    format: /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/,
  },
  system: { type: 'string', format: /(android|ios|web|server)/ },
  ip: {
    type: 'string',
    format: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  },
  demand: { type: 'string', min: 0, max: 30 },
  country: { type: 'string', required: false },
  province: { type: 'string', required: false },
  city: { type: 'string', required: false },
  params: { type: 'string' },
  useragent: { type: 'string' },
  deviceId: { type: 'string' },
}

const trackingDelRule = {
  demand: { type: 'string', min: 0, max: 30 },
}

class Tracking extends Controller {
  async get() {
    const { ctx, service } = this
    const { query } = ctx.request
    const { skip, limit, event, system, demand, deviceId } = query
    const errors = await ctx.validate(eventGetRule, query)

    if (errors) {
      ctx.status = 422
      ctx.body = ctx.responseBody(false, { errors })
      return
    }

    const querys = {}
    if (event) {
      querys.event = event
    }
    if (system) {
      querys.system = system
    }
    if (demand) {
      querys.demand = demand
    }
    if (deviceId) {
      querys.deviceId = deviceId
    }

    const findRes = await service.event.find(querys, skip, limit)
    ctx.body = ctx.responseBody(true, { data: findRes })
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
    const { demand, event, params } = body

    const errors = await ctx.validate(eventPostRule, body)

    if (errors) {
      ctx.status = 422
      ctx.body = ctx.responseBody(false, { errors })
      return
    }

    const findRes = await service.tracking.find({ demand, event })

    if (!findRes.total) {
      ctx.status = 403
      ctx.body = ctx.responseBody(false, {
        msg: '需求或者事件不存在，请联系管理员进行修改',
      })
      return
    }

    try {
      const parseParams = JSON.parse(params)
      if (typeof parseParams !== 'object') {
        ctx.status = 422
        ctx.body = ctx.responseBody(false, {
          msg: '字段错误',
        })
        return
      }
    } catch (error) {
      console.log(error)
      ctx.status = 422
      ctx.body = ctx.responseBody(false, {
        msg: '字段错误',
      })
      return
    }

    const insertResult = await service.event.insert(body)

    if (insertResult) {
      ctx.body = ctx.responseBody(true, { msg: '创建成功' })
      return
    }
    ctx.body = ctx.responseBody(false, { msg: '创建失败，请稍后重试' })
  }
}

module.exports = Tracking
