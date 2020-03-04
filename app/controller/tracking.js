const { Controller } = require('egg')

const trackingGetRule = {
  system: {
    type: 'string',
    required: false,
    format: /(android|ios|web|servers)/,
  },
  event: { type: 'string', format: /\w{1,20}/, required: false },
  type: { type: 'number', min: 0, max: 1, required: false },
  demand: { type: 'string', min: 0, max: 30, required: false },
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
}

const trackingPostRule = {
  system: { type: 'string', format: /(android|ios|web|servers)/ },
  event: { type: 'string', format: /\w{1,20}/ },
  describe: { type: 'string', min: 0, max: 100 },
  type: { type: 'number', min: 0, max: 1 },
  demand: { type: 'string', min: 0, max: 30 },
  principalFE: { type: 'string', min: 0, max: 20, required: false },
  principalPM: { type: 'string', min: 0, max: 20, required: false },
  principalQA: { type: 'string', min: 0, max: 20, required: false },
  principalRD: { type: 'string', min: 0, max: 20, required: false },
  principalIos: { type: 'string', min: 0, max: 20, required: false },
  principalAndroid: { type: 'string', min: 0, max: 20, required: false },
  params: { type: 'array' },
  version: { type: 'string', format: /^(\d{1,2}\.){2}\d{1,2}$/ },
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

    const insertResult = await service.tracking.insert(body)

    if (insertResult) {
      ctx.body = ctx.responseBody(true, { msg: '埋点创建成功' })
      return
    }
    ctx.body = ctx.responseBody(false, { msg: 'create account error' })
  }
}

module.exports = Tracking
