const { Service } = require('egg')

class UserService extends Service {
  async find(querys = {}, skip, limit) {
    const list = await this.ctx.model.User.find(querys, {
      _id: 0,
      __v: 0,
      password: 0,
    })
      .sort({ _id: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
    const total = await this.ctx.model.User.find(querys, {
      _id: 0,
      __v: 0,
    }).countDocuments()
    return { list, total }
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

  async updateAdmin({ username }, { admin }) {
    const result = await this.ctx.model.User.update(
      { username },
      { $set: { admin } },
    )
    return result
  }

  async delete({ username }) {
    const result = await this.ctx.model.User.remove({ username })
    return result
  }
}

module.exports = UserService
