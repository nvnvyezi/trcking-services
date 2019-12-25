const jwt = require('../constant/jwt.json')
const redis = require('../constant/redis.json')

exports.middleware = ['jwt']

exports.security = {
  csrf: false,
}

exports.validate = {
  validateRoot: true,
  convert: true,
}

exports.jwt = {
  enable: true,
  ignore: [/^\/api\/(login|registry)$/, /^\/$/],
  secret: jwt.secret,
  expiresIn: '1h',
}

exports.redis = {
  client: {
    port: redis.port,
    host: redis.host,
    password: redis.password,
    db: redis.db,
  },
  expires: 7 * 12 * 60 * 60 * 1000 + Date.now(),
}
exports.cluster = {
  listen: {
    port: 8001,
  },
}
