const { Service } = require('egg')

class TrackService extends Service {
  async findAll(querys) {
    const result = await this.ctx.model.Tracking.find(querys)
    return result
  }

  async find(querys = {}) {
    const result = await this.ctx.model.Tracking.findOne(querys)
    return result
  }

  async insert(params) {
    const result = await this.ctx.model.Tracking.create(params)
    return result
  }
}

module.exports = TrackService
