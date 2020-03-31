const { Controller } = require('egg')
const NodeRSA = require('node-rsa')

const { privateKey } = require('../../constant/rsa')

const userRule = {
  username: { type: 'string', max: 16, min: 1 },
  password: {
    type: 'password',
    format: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/,
  },
  remember: { type: 'boolean' },
}

class Login extends Controller {
  async index() {
    const { ctx, service, app } = this
    const { username, password, remember } = ctx.request.body
    const { secret } = app.config.jwt
    const { expires } = app.config.redis

    const jsencrypt = new NodeRSA(privateKey)
    // 因为jsencrypt自身使用的是pkcs1加密方案, nodejs需要修改成pkcs1。
    jsencrypt.setOptions({ encryptionScheme: 'pkcs1' })

    let dePassword = ''
    try {
      dePassword = jsencrypt.decrypt(password, 'utf8')
    } catch (error) {
      ctx.status = 422
      ctx.body = ctx.responseBody(false, { msg: '字段非法' })
      return
    }

    const errors = await ctx.validate(userRule, {
      ...ctx.request.body,
      password: dePassword,
    })

    if (errors) {
      ctx.status = 422
      ctx.body = ctx.responseBody(false, { errors })
      return
    }

    const findRes = await service.user.findOne({
      username,
      password: dePassword,
    })

    if (!findRes || findRes.username !== username) {
      ctx.status = 403
      ctx.body = ctx.responseBody(false, { msg: '账号不存在或者密码错误' })
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
      await app.redis.setex(username, expires, username)
    }

    ctx.set({
      Authorization: `bearer ${token}`,
    })

    ctx.body = ctx.responseBody(true, {
      data: { admin: findRes.admin, username, email: findRes.email },
    })
  }
}

module.exports = Login
