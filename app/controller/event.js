const { Controller } = require('egg')

const eventGetRule = {
  event: { type: 'string', format: /^\w{1,40}$/, required: false },
  system: {
    type: 'string',
    required: false,
    format: /(android|ios|web|server)/,
  },
  demand: { type: 'string', min: 0, max: 30, required: false },
  deviceId: { type: 'string', required: false },
}

const eventCountRule = {
  event: { type: 'string', format: /^\w{1,40}$/ },
  demand: { type: 'string', min: 0, max: 30 },
  startTime: { type: 'string' },
  endTime: { type: 'string' },
}

const eventPostRule = {
  event: { type: 'string', format: /^\w{1,40}$/ },
  url: {
    type: 'string',
    format: /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/,
  },
  system: { type: 'string', format: /(android|ios|web|server)/ },
  ip: {
    type: 'string',
    format: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  },
  demand: { type: 'string', min: 0, max: 30 },
  country: { type: 'string', required: false },
  province: { type: 'string', required: false },
  city: { type: 'string', required: false },
  params: { type: 'string' },
  useragent: { type: 'string' },
  deviceId: { type: 'string' },
}

function getNextDate(dayStr) {
  const dd = new Date(dayStr)
  dd.setDate(dd.getDate() + 1)
  const y = dd.getFullYear()
  const m = dd.getMonth() + 1
  const d = dd.getDate()
  return y + '-' + String(m).padStart(2, 0) + '-' + String(d).padStart(2, 0)
}

class Tracking extends Controller {
  async getAllEvent() {
    const { ctx, service } = this
    const findRes = await service.event.findAllEvent()
    ctx.body = ctx.responseBody(true, { data: findRes })
  }

  async getAllDemand() {
    const { ctx, service } = this
    const findRes = await service.event.findAllDemand()
    ctx.body = ctx.responseBody(true, { data: findRes })
  }

  async get() {
    const { ctx, service } = this
    const { query } = ctx.request
    const {
      skip,
      limit,
      event,
      system,
      demand,
      endTime,
      deviceId,
      startTime,
    } = query
    const errors = await ctx.validate(eventGetRule, query)

    if (errors) {
      ctx.status = 422
      ctx.body = ctx.responseBody(false, { errors })
      return
    }

    const querys = {}
    if (event) {
      querys.event = event
    }
    if (system) {
      querys.system = system
    }
    if (demand) {
      querys.demand = demand
    }
    if (deviceId) {
      querys.deviceId = deviceId
    }
    const timeQuery = {}
    if (startTime) {
      timeQuery.$gte = new Date(`${startTime} 00:00:00`)
    }
    if (startTime) {
      timeQuery.$lt = new Date(`${endTime} 23:59:59`)
    }
    querys.createTime = timeQuery

    const findRes = await service.event.find(querys, skip, limit)
    ctx.body = ctx.responseBody(true, { data: findRes })
  }

  async getCount() {
    const { ctx, service } = this
    const { query } = ctx.request
    const { event, demand, endTime, startTime } = query
    const errors = await ctx.validate(eventCountRule, query)

    if (errors) {
      ctx.status = 422
      ctx.body = ctx.responseBody(false, { errors })
      return
    }

    const allTime = [startTime]
    let currTime = startTime
    while (currTime !== endTime) {
      currTime = getNextDate(currTime)
      allTime.push(currTime)
    }

    let listRes = []

    try {
      const promiseArr = allTime.map(async time => {
        const findRes = await service.event.findCount(
          {
            demand,
            event,
            createTime: {
              $gte: new Date(`${time} 00:00:00`),
              $lt: new Date(`${time} 23:59:59`),
            },
          },
          time,
        )
        return findRes
      })

      listRes = await Promise.all(promiseArr)
    } catch (error) {
      ctx.status = 498
      ctx.body = ctx.responseBody(false, {
        msg: '查询出错，请稍后再试',
      })
      return
    }

    ctx.body = ctx.responseBody(true, { data: listRes })
  }

  async create() {
    const { ctx, service } = this
    const { body } = ctx.request
    const { demand, event, params } = body

    const errors = await ctx.validate(eventPostRule, body)

    if (errors) {
      ctx.status = 422
      ctx.body = ctx.responseBody(false, { errors })
      return
    }

    const findRes = await service.tracking.find({ demand, event })

    if (!findRes.total) {
      ctx.status = 403
      ctx.body = ctx.responseBody(false, {
        msg: '需求或者事件不存在，请联系管理员进行修改',
      })
      return
    }

    try {
      const parseParams = JSON.parse(params)
      if (typeof parseParams !== 'object') {
        ctx.status = 422
        ctx.body = ctx.responseBody(false, {
          msg: '字段错误',
        })
        return
      }
    } catch (error) {
      console.log(error)
      ctx.status = 422
      ctx.body = ctx.responseBody(false, {
        msg: '字段错误',
      })
      return
    }

    const insertResult = await service.event.insert(body)

    if (insertResult) {
      ctx.body = ctx.responseBody(true, { msg: '创建成功' })
      return
    }
    ctx.body = ctx.responseBody(false, { msg: '创建失败，请稍后重试' })
  }
}

module.exports = Tracking
