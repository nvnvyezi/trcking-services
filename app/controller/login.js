const Controller = require('egg').Controller

class Login extends Controller {
  async index() {
    const { ctx, service } = this
    const { username, password, team } = ctx.request.body

    const createRule = {
      username: { type: 'string', format: '', max: 16, min: 6 },
      password: { type: 'password', compare: '', max: 16, min: 6 },
      team: { type: 'string', trim: true, min: 3, max: 4 },
      email: { type: 'email', allowEmpty: true, required: false },
    }

    const errors = await ctx.app.validate(createRule, ctx.request.body)

    if (errors) {
      ctx.status = 422
      ctx.body = ctx.responseBody(false, { errors })
      return
    }

    const users = await service.user.find(username, password, team)

    if (!users || !users.length) {
      ctx.status = 403
      ctx.body = ctx.responseBody(false, { msg: '没有权限访问' })
      return
    }

    ctx.body = ctx.responseBody(true, { username, team })
  }
}

module.exports = Login
