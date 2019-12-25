const { Controller } = require('egg')

const userRule = {
  username: { type: 'string', format: '', max: 16, min: 1 },
  password: { type: 'password', compare: '', max: 16, min: 6 },
  email: { type: 'email', allowEmpty: true, required: false },
  admin: { type: 'boolean' },
}

class Registry extends Controller {
  async index() {
    const { ctx, service } = this
    const { username, email } = ctx.request.body

    const errors = await ctx.validate(userRule, ctx.request.body)

    if (errors) {
      ctx.status = 422
      ctx.body = ctx.responseBody(false, { errors })
      return
    }

    const nameResult = await service.user.findFromName(username)

    if (nameResult && nameResult.username) {
      ctx.status = 499
      ctx.body = ctx.responseBody(false, { msg: 'Account already exist' })
      return
    }

    const emailResult = await service.user.findFromEmail(email)

    if (emailResult && emailResult.email) {
      ctx.status = 498
      ctx.body = ctx.responseBody(false, { msg: 'Email already exist' })
      return
    }

    const insertResult = await service.user.insert(ctx.request.body)

    if (insertResult && insertResult.username === username) {
      ctx.body = ctx.responseBody(true, { username, email })
      return
    }
    ctx.body = ctx.responseBody(false, { msg: 'create account error' })
  }
}

module.exports = Registry
