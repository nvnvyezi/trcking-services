const jwt = require('../constant/jwt.json')
const redis = require('../constant/redis.json')
const mongoose = require('../constant/mongoose.json')

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
  ignore: [/^\/api\/v1\/(login|register|user\/status)$/, /^\/$/],
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
  expires: 302400,
}
exports.cluster = {
  listen: {
    port: 8001,
  },
}

exports.mongoose = {
  client: {
    url: mongoose.url,
    options: {
      useUnifiedTopology: true,
    },
  },
}
