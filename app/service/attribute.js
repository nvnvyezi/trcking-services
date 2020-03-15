const { Service } = require('egg')

class TrackService extends Service {
  async find(querys = {}) {
    const result = await this.ctx.model.Attribute.find(querys)
    return result
  }

  async insert(params) {
    const result = await this.ctx.model.Attribute.create(params)
    return result
  }
}

module.exports = TrackService
