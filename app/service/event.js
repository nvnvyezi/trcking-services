const { Service } = require('egg')

class EventService extends Service {
  async find(querys = {}, skip, limit) {
    const list = await this.ctx.model.Event.find(querys, {
      _id: 0,
      __v: 0,
    })
      .sort({ _id: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
    const total = await this.ctx.model.Event.find(querys, {
      _id: 0,
      __v: 0,
    }).countDocuments()
    return { list, total }
  }

  async findCount(querys = {}, time) {
    const total = await this.ctx.model.Event.find(querys, {
      _id: 0,
      __v: 0,
    }).countDocuments()
    return { time, total }
  }

  async findAllEvent() {
    const result = (await this.ctx.model.Event.distinct('event')) || []
    return result.filter(item => !!item)
  }

  async findAllDemand() {
    const result = (await this.ctx.model.Event.distinct('demand')) || []
    return result.filter(item => !!item)
  }

  async updateStatus({ demand }, { status }, { multi = false }) {
    const result = await this.ctx.model.Event.update(
      { demand },
      { $set: { status } },
      { multi },
    )
    return result
  }

  async delete({ demand }) {
    const result = await this.ctx.model.Event.remove({ demand })
    return result
  }

  async insert({
    ip,
    url,
    city,
    event,
    params,
    demand,
    system,
    country,
    province,
    useragent,
  }) {
    const result = await this.ctx.model.Event.create({
      ip,
      url,
      city,
      event,
      params,
      demand,
      system,
      country,
      province,
      useragent,
    })
    return result
  }
}

module.exports = EventService
