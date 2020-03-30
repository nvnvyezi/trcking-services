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

  async insert({ username, password, email }) {
    const result = await this.ctx.model.User.create({
      email,
      username,
      password,
    })
    return result
  }

  async update({ username }, { email, password }) {
    const result = await this.ctx.model.User.update(
      { username },
      { $set: { email, password } },
    )
    return result
  }
}

module.exports = UserService
