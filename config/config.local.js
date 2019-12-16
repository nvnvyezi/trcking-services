const mongoose = require('../constant/mongoose.json')

exports.mongoose = {
  client: {
    url: mongoose.url,
    options: {},
  },
}

exports.baseUrl = 'http://127.0.0.1:7001'
