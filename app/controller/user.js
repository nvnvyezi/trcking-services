const { Controller } = require('egg')
const NodeRSA = require('node-rsa')

const { privateKey } = require('../../constant/rsa')

const userUpdateRule = {
  username: { type: 'string', max: 16, min: 1 },
  password: {
    type: 'password',
    format: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/,
  },
  passwordOld: {
    type: 'password',
    format: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/,
  },
  email: {
    type: 'email',
    required: false,
    format: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
  },
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

  async update() {
    const { ctx, service } = this
    const { body } = ctx.request
    const { username, password, email, passwordOld } = body

    const jsencrypt = new NodeRSA(privateKey)
    // 因为jsencrypt自身使用的是pkcs1加密方案, nodejs需要修改成pkcs1。
    jsencrypt.setOptions({ encryptionScheme: 'pkcs1' })

    let dePassword = ''
    let dePasswordOld = ''
    try {
      dePassword = jsencrypt.decrypt(password, 'utf8')
      dePasswordOld = jsencrypt.decrypt(passwordOld, 'utf8')
    } catch (error) {
      ctx.status = 422
      ctx.body = ctx.responseBody(false, { msg: '字段非法' })
      return
    }

    const errors = await ctx.validate(userUpdateRule, {
      ...ctx.request.body,
      password: dePasswordOld,
    })

    if (errors) {
      ctx.status = 422
      ctx.body = ctx.responseBody(false, { errors })
      return
    }

    const findRes = await service.user.findOne({
      username,
      password: dePasswordOld,
    })

    if (!findRes || findRes.username !== username) {
      ctx.status = 498
      ctx.body = ctx.responseBody(false, { msg: '原密码错误' })
      return
    }

    if (dePassword === dePasswordOld) {
      ctx.status = 498
      ctx.body = ctx.responseBody(false, { msg: '新密码不能和旧密码一样' })
      return
    }

    const updateRes = await service.user.update(
      { username },
      { email, password: dePassword },
    )
    if (updateRes.ok === 1) {
      ctx.body = ctx.responseBody(true, { data: 'ok' })
      return
    }

    ctx.status = 500
    ctx.body = ctx.responseBody(false, { data: '修改失败' })
  }
}

module.exports = Login
