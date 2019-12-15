const Controller = require('egg').Controller

class Login extends Controller {
  async index() {
    console.log(
      'login',
      this.ctx.request.body,
      this.ctx.request.queries,
      this.ctx.ip,
    )
    const createRule = {
      username: { type: 'string', format: '', max: 16, min: 6 },
      password: { type: 'password', compare: '', max: 16, min: 6 },
      team: { type: 'string', trim: true, min: 3, max: 4 },
      email: { type: 'email', allowEmpty: true, required: false },
    }

    const errors = await this.ctx.app.validate(
      createRule,
      this.ctx.request.body,
    )
    if (errors) {
      console.log('validate errors', errors)
      this.ctx.status = 422
      this.ctx.body = {
        success: false,
        msg: errors,
      }
      return
    }

    this.ctx.body = { text: 'hello world!' }
  }
}

module.exports = Login
