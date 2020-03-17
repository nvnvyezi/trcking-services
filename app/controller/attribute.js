const { Controller } = require('egg')

const attributeGetRule = {
  skip: { type: 'number', required: false },
  limit: { type: 'number', required: false },
  creator: { type: 'string', max: 20, required: false },
  name: { type: 'string', format: /\w{0,20}/, required: false },
  type: { type: 'string', format: /(string|boolean|number)$/, required: false },
}

const attributePostRule = {
  creator: { type: 'string', max: 20 },
  describe: { type: 'string', max: 100 },
  name: { type: 'string', format: /\w{1,20}/ },
  type: { type: 'string', format: /(string|boolean|number)/ },
}

const attributeDelRule = {
  name: { type: 'string', format: /\w{1,20}/ },
}

class Attributes extends Controller {
  async get() {
    const { ctx, service } = this
    const {
      query: { creator, type, name, skip, limit },
    } = ctx.request
    const errors = await ctx.validate(attributeGetRule, ctx.request.query)

    if (errors) {
      ctx.status = 422
      ctx.body = ctx.responseBody(false, { errors })
      return
    }

    const querys = {
      name: { $regex: new RegExp(name) },
      creator: { $regex: new RegExp(creator) },
    }
    if (type) {
      querys.type = type
    }

    const findRes = await service.attribute.find(querys, skip, limit)
    ctx.body = ctx.responseBody(true, { data: findRes })
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

    const insertResult = await service.attribute.insert(body)

    if (insertResult) {
      ctx.body = ctx.responseBody(true, { msg: '属性创建成功' })
      return
    }
    ctx.body = ctx.responseBody(false, { msg: '创建属性失败，请稍后重试' })
  }

  async delete() {
    const { ctx, service } = this
    const { body } = ctx.request

    const errors = await ctx.validate(attributeDelRule, body)

    if (errors) {
      ctx.status = 422
      ctx.body = ctx.responseBody(false, { errors })
      return
    }

    const delRes = await service.attribute.delete({ name: body.name })

    if (delRes.deletedCount === 0) {
      ctx.status = 204
      ctx.body = ctx.responseBody(false)
      return
    }

    ctx.body = ctx.responseBody(true, { data: 'ok' })
  }
}

module.exports = Attributes
