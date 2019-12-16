const jwt = require('../constant/mongoose.json')

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
  enable: true,
  secret: jwt.secret,
}
