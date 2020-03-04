module.exports = app => {
  const { mongoose } = app
  const { Schema } = mongoose

  const ParamSchema = new Schema({
    name: String,
    type: String,
    describe: String,
  })

  const trackingSchema = new Schema({
    system: {
      type: String,
    },
    event: {
      type: String,
    },
    describe: {
      type: String,
    },
    type: {
      type: Number,
    },
    demand: {
      type: String,
    },
    principalFE: {
      type: String,
    },
    principalPM: {
      type: String,
    },
    principalQA: {
      type: String,
    },
    principalRD: {
      type: String,
    },
    principalIos: {
      type: String,
    },
    principalAndroid: {
      type: String,
    },
    params: {
      type: [ParamSchema],
    },
    version: {
      type: String,
    },
    createTime: {
      type: Date,
    },
  })

  return mongoose.model('tracking', trackingSchema)
}
