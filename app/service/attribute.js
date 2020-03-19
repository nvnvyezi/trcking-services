const { Service } = require('egg')

class TrackService extends Service {
  async find(querys = {}, skip, limit) {
    const list = await this.ctx.model.Attribute.find(querys, {
      _id: 0,
      __v: 0,
    })
      .sort({ _id: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
    const total = await this.ctx.model.Attribute.find(querys, {
      _id: 0,
      __v: 0,
    }).count()
    return { list, total }
  }

  async insert(params) {
    const result = await this.ctx.model.Attribute.create(params)
    return result
  }

  async update(params, updateParams) {
    const result = await this.ctx.model.Attribute.update(params, {
      $set: updateParams,
    })
    return result
  }

  async delete(params) {
    const result = await this.ctx.model.Attribute.remove(params)
    return result
  }
}

module.exports = TrackService
