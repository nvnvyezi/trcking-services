const { Service } = require('egg')

class TrackService extends Service {
  async findAll(querys) {
    const result = await this.ctx.model.Tracking.find(querys)
    return result
  }
  async find(querys = {}, skip, limit) {
    const list = await this.ctx.model.Tracking.find(querys, {
      _id: 0,
      __v: 0,
    })
      .sort({ _id: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
    const total = await this.ctx.model.Tracking.find(querys, {
      _id: 0,
      __v: 0,
    }).count()
    return { list, total }
  }

  async insert({
    type,
    event,
    params,
    demand,
    system,
    version,
    describe,
    principalQA,
    principalRD,
    principalPM,
    principalFE,
    principalIos,
    principalAndroid,
  }) {
    console.log({
      type,
      event,
      params,
      demand,
      system,
      version,
      describe,
      principalQA,
      principalRD,
      principalPM,
      principalFE,
      principalIos,
      principalAndroid,
    })
    const result = await this.ctx.model.Tracking.create({
      type,
      event,
      params,
      demand,
      system,
      version,
      describe,
      principalPM,
      principalFE,
      principalQA,
      principalRD,
      principalIos,
      principalAndroid,
    })
    return result
  }
}

module.exports = TrackService
