const { Service } = require('egg')

class TrackService extends Service {
  async find(querys = {}, skip, limit) {
    const result = await this.ctx.model.Attribute.find(querys, {
      _id: 0,
      __v: 0,
    })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
    return result
  }

  async insert(params) {
    const result = await this.ctx.model.Attribute.create(params)
    return result
  }

  async delete(params) {
    const result = await this.ctx.model.Attribute.remove(params)
    return result
  }
}

module.exports = TrackService
