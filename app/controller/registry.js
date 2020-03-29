const { Controller } = require('egg')
const NodeRSA = require('node-rsa')

const { privateKey } = require('../../constant/rsa')

const userRule = {
  username: { type: 'string', max: 16, min: 1 },
  password: {
    type: 'password',
    format: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/,
  },
  email: {
    type: 'email',
    required: false,
    format: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
  },
}

class Registry extends Controller {
  async index() {
    const { ctx, service } = this
    const { body } = ctx.request
    const { username, password, email } = body

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
      ...body,
      password: dePassword,
    })

    if (errors || !username.trim().length) {
      ctx.status = 422
      ctx.body = ctx.responseBody(false, { errors })
      return
    }

    const findRes = await service.user.findOne({ username })

    if (findRes && findRes.username === username) {
      ctx.status = 499
      ctx.body = ctx.responseBody(false, { msg: '账号已存在' })
      return
    }

    if (email) {
      const findEmailRes = await service.user.findOne({ email })

      if (findEmailRes && findEmailRes.email === email) {
        ctx.status = 498
        ctx.body = ctx.responseBody(false, { msg: '邮箱已存在' })
        return
      }
    }

    const insertRes = await service.user.insert({
      ...body,
      password: dePassword,
    })

    if (insertRes && insertRes.username === username) {
      ctx.body = ctx.responseBody(true, { username, email })
      return
    }
    ctx.body = ctx.responseBody(false, { msg: '账号创建成功' })
  }
}

module.exports = Registry
