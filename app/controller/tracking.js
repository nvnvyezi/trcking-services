const { Controller } = require('egg')

const trackingGetRule = {
  type: { type: 'number', min: 0, max: 1, required: false },
  demand: { type: 'string', min: 0, max: 30, required: false },
  event: { type: 'string', format: /\w{1,20}/, required: false },
  principalFE: { type: 'string', min: 0, max: 20, required: false },
  principalPM: { type: 'string', min: 0, max: 20, required: false },
  principalQA: { type: 'string', min: 0, max: 20, required: false },
  principalRD: { type: 'string', min: 0, max: 20, required: false },
  principalIos: { type: 'string', min: 0, max: 20, required: false },
  principalAndroid: { type: 'string', min: 0, max: 20, required: false },
  version: {
    type: 'string',
    required: false,
    format: /^(\d{1,2}\.){2}\d{1,2}$/,
  },
  system: {
    type: 'string',
    required: false,
    format: /(android|ios|web|servers)/,
  },
}

const trackingPostRule = {
  params: { type: 'array' },
  type: { type: 'number', min: 0, max: 1 },
  demand: { type: 'string', min: 0, max: 30 },
  event: { type: 'string', format: /\w{1,20}/ },
  describe: { type: 'string', min: 0, max: 100 },
  principalPM: { type: 'string', min: 0, max: 20 },
  version: { type: 'string', format: /^(\d{1,2}\.){2}\d{1,2}$/ },
  system: { type: 'string', format: /(android|ios|web|servers)/ },
  principalFE: { type: 'string', min: 0, max: 20, required: false },
  principalQA: { type: 'string', min: 0, max: 20, required: false },
  principalRD: { type: 'string', min: 0, max: 20, required: false },
  principalIos: { type: 'string', min: 0, max: 20, required: false },
  principalAndroid: { type: 'string', min: 0, max: 20, required: false },
}

class Tracking extends Controller {
  async get() {
    const { ctx, service } = this
    const { query } = ctx.request
    const errors = await ctx.validate(trackingGetRule, query)

    if (errors) {
      ctx.status = 422
      ctx.body = ctx.responseBody(false, { errors })
      return
    }

    const result = await service.tracking.findAll(query)
    ctx.body = ctx.responseBody(true, { data: result })
    return
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

    body.createTime = new Date()
    const insertResult = await service.tracking.insert(body)

    if (insertResult) {
      ctx.body = ctx.responseBody(true, { msg: '埋点创建成功' })
      return
    }
    ctx.body = ctx.responseBody(false, { msg: '创建埋点失败，请稍后重试' })
  }
}

module.exports = Tracking
