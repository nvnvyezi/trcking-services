const jwt = require('jsonwebtoken')

const JWT = Symbol('Application#jwt')

module.exports = {
  get jwt() {
    if (!this[JWT]) {
      const { secret: initSecret, expiresIn, verify = {} } = this.config.jwt
      // this[JWT] = koajwt(config)

      this[JWT] = {}
      this[JWT].sign = (
        payload,
        secret = initSecret,
        options = { expiresIn },
      ) => {
        return jwt.sign(payload, secret, options)
      }

      this[JWT].verify = (
        token,
        secret = initSecret,
        options = { expiresIn },
      ) => {
        return jwt.verify(token, secret, {
          ...verify,
          ...options,
        })
      }

      this[JWT].decode = jwt.decode
    }
    return this[JWT]
  },
}
