exports.keys = 'nvnyezi'

exports.security = {
  csrf: false,
}

exports.validate = {
  validateRoot: true,
  convert: true,
}

exports.middleware = ['token']
