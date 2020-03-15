const { Controller } = require('egg')

const attributeGetRule = {
  creator: { type: 'string', max: 20, required: false },
  type: { type: 'string', format: /(string|boolean|number)$/, required: false },
}

const attributePostRule = {
  creator: { type: 'string', max: 20 },
  describe: { type: 'string', max: 100 },
  name: { type: 'string', format: /\w{1,20}/ },
  type: { type: 'string', format: /(string|boolean|number)/ },
}

class Attributes extends Controller {
  async get() {
    const { ctx, service } = this
    const { query } = ctx.request
    const errors = await ctx.validate(attributeGetRule, query)

    if (errors) {
      ctx.status = 422
      ctx.body = ctx.responseBody(false, { errors })
      return
    }

    const result = await service.attribute.find(query)
    ctx.body = ctx.responseBody(true, { data: result })
  }

  async create() {
    const { ctx, service } = this
    const { body } = ctx.request

    const errors = await ctx.validate(attributePostRule, body)

    if (errors) {
      ctx.status = 422
      ctx.body = ctx.responseBody(false, { errors })
      return
    }

    const findRes = await service.attribute.find({ name: body.name })

    if (findRes.length) {
      ctx.status = 403
      ctx.body = ctx.responseBody(false, { msg: '属性已存在' })
      return
    }

    const insertResult = await service.attribute.insert({
      ...body,
      createTime: new Date().valueOf(),
    })

    if (insertResult) {
      ctx.body = ctx.responseBody(true, { msg: '属性创建成功' })
      return
    }
    ctx.body = ctx.responseBody(false, { msg: '创建属性失败，请稍后重试' })
  }
}

module.exports = Attributes
