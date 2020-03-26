const { Controller } = require('egg')
const NodeRSA = require('node-rsa')

const { privateKey } = require('../../constant/rsa')

const userRule = {
  username: { type: 'string', format: '', max: 16, min: 1 },
  password: { type: 'password', compare: '', max: 16, min: 6 },
  remember: { type: 'boolean' },
}

const userStatusRule = {
  username: { type: 'string', format: '', max: 16, min: 1 },
}

class Login extends Controller {
  async getUserStatus() {
    const { ctx, app } = this
    const { query } = ctx.request
    const { username } = query
    const errors = await ctx.validate(userStatusRule, query)

    if (errors) {
      ctx.status = 422
      ctx.body = ctx.responseBody(false, { errors })
      return
    }

    const cacheUserName = await app.redis.get(username)
    if (cacheUserName) {
      ctx.body = ctx.responseBody(true, { data: 'ok' })
      return
    }

    ctx.status = 401
    ctx.body = ctx.responseBody(false, { msg: '未登录' })
  }

  async delUserStatus() {
    const { ctx, app } = this
    const { body } = ctx.request
    const { username } = body
    const errors = await ctx.validate(userStatusRule, body)

    if (errors) {
      ctx.status = 422
      ctx.body = ctx.responseBody(false, { errors })
      return
    }

    const delRes = await app.redis.del(username)

    if (delRes === 1) {
      ctx.body = ctx.responseBody(true, { data: 'ok' })
      return
    }

    ctx.status = 500
    ctx.body = ctx.responseBody(false, { msg: '退出失败' })
  }

  async index() {
    const { ctx, service, app } = this
    const { username, password, remember } = ctx.request.body
    const { secret } = app.config.jwt
    const { expires } = app.config.redis
    const jsencrypt = new NodeRSA(privateKey)
    // 因为jsencrypt自身使用的是pkcs1加密方案, nodejs需要修改成pkcs1。
    jsencrypt.setOptions({ encryptionScheme: 'pkcs1' })
    const dePassword = jsencrypt.decrypt(password, 'utf8')

    const errors = await ctx.validate(userRule, {
      ...ctx.request.body,
      password: dePassword,
    })

    if (errors) {
      ctx.status = 422
      ctx.body = ctx.responseBody(false, { errors })
      return
    }

    const users = await service.user.findFromLogin(username, dePassword)

    if (!users || !users.username) {
      ctx.status = 403
      ctx.body = ctx.responseBody(false, { msg: '账号不存在' })
      return
    }

    const token = app.jwt.sign(
      {
        iss: 'liliye',
        sub: 'buried-point-management',
        username,
      },
      secret,
    )

    if (remember) {
      await app.redis.setnx(username, username)
      const expiresStatus = await app.redis.pexpireat(username, expires)

      if (expiresStatus === 0) {
        await app.redis.del(username)
      }
    }

    ctx.set({
      Authorization: `bearer ${token}`,
    })

    ctx.body = ctx.responseBody(true, { username, remember })
  }
}

module.exports = Login
