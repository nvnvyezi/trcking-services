const jwt = require('../constant/jwt.json')

exports.keys = 'nvnyezi'

exports.security = {
  csrf: false,
}

exports.validate = {
  validateRoot: true,
  convert: true,
}

exports.middleware = ['token']

exports.jwt = {
  secret: jwt.secret,
  expiresIn: '1h',
  ignore: [/^\/$/],
}
