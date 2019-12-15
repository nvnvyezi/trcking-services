const Parameter = require('parameter')

module.exports = app => {
  app.validator = new Parameter(app.config.validate)
}
