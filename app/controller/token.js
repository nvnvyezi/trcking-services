const { Controller } = require('egg')

class TokenController extends Controller {
  async set() {
    const { ctx } = this

    ctx.body = ctx.responseBody(true, { msg: 'test success' })
  }
}

module.exports = TokenController
