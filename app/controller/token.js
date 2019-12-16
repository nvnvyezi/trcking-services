const { Controller } = require('egg')

class TokenController extends Controller {
  async set() {
    const { ctx, app } = this
    const { secret } = app.config.jwt
    const token = app.jwt.sign({ firstCome: true }, secret)

    if (!token) {
      ctx.body = ctx.responseBody(false)
      return
    }

    ctx.set({
      Authorization: `bearer ${token}`,
    })
    ctx.body = ctx.responseBody(true, { msg: 'token success' })
  }
}

module.exports = TokenController
