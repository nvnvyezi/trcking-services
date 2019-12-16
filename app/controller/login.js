const { Controller } = require('egg')

const userRule = {
  username: { type: 'string', format: '', max: 16, min: 6 },
  password: { type: 'password', compare: '', max: 16, min: 6 },
  team: { type: 'string', trim: true, min: 3, max: 4 },
  email: { type: 'email', allowEmpty: true, required: false },
}

class Login extends Controller {
  async index() {
    const { ctx, service, app } = this
    const { username, password, team } = ctx.request.body
    const { secret } = app.config.jwt

    const errors = await ctx.app.validate(userRule, ctx.request.body)

    if (errors) {
      ctx.status = 422
      ctx.body = ctx.responseBody(false, { errors })
      return
    }

    const users = await service.user.find(username, password, team)

    if (!users || !users.length) {
      ctx.status = 403
      ctx.body = ctx.responseBody(false, { msg: 'Account does not exist' })
      return
    }

    const token = app.jwt.sign(
      {
        iss: 'liliye',
        sub: 'buried-point-management',
        username,
      },
      secret,
    )

    ctx.set({
      Authorization: `bearer ${token}`,
    })

    ctx.body = ctx.responseBody(true, { username, team })
  }
}

module.exports = Login
