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

  async insert({ name, type, describe, creator, updater }) {
    const result = await this.ctx.model.Attribute.create({
      name,
      type,
      creator,
      updater,
      describe,
    })
    return result
  }

  async insertBatch(params) {
    const result = await this.ctx.model.Attribute.insertMany(params)
    return result
  }

  async update({ name }, { describe, type, updater }) {
    const result = await this.ctx.model.Attribute.update(
      { name },
      {
        $set: { describe, type, updater },
      },
    )
    return result
  }

  async delete({ name }) {
    const result = await this.ctx.model.Attribute.remove({ name })
    return result
  }
}

module.exports = TrackService
