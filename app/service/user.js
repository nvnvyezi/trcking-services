const { Service } = require('egg')

class UserService extends Service {
  async find(querys = {}) {
    const result = await this.ctx.model.User.find(querys)
    return result
  }

  async findOne(querys = {}) {
    const result = await this.ctx.model.User.findOne(querys)
    return result
  }

  async insert(params) {
    const result = await this.ctx.model.User.create(params)
    return result
  }
}

module.exports = UserService
