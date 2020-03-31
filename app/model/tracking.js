module.exports = app => {
  const { mongoose } = app
  const { Schema } = mongoose

  const ParamSchema = new Schema({
    name: String,
    type: String,
    describe: String,
  })

  const trackingSchema = new Schema(
    {
      system: {
        trim: true,
        type: String,
        require: true,
        default: 'ios',
      },
      event: {
        trim: true,
        type: String,
        require: true,
      },
      describe: {
        trim: true,
        type: String,
        require: true,
      },
      type: {
        trim: true,
        type: String,
        require: true,
        default: 'normal',
      },
      demand: {
        trim: true,
        index: true,
        type: String,
        require: true,
      },
      principalFE: {
        trim: true,
        type: String,
      },
      principalPM: {
        trim: true,
        type: String,
      },
      principalQA: {
        trim: true,
        type: String,
        require: true,
      },
      principalRD: {
        trim: true,
        type: String,
      },
      principalIos: {
        trim: true,
        type: String,
      },
      principalAndroid: {
        trim: true,
        type: String,
      },
      params: {
        trim: true,
        require: true,
        type: [ParamSchema],
      },
      version: {
        trim: true,
        type: String,
        require: true,
      },
      createTime: {
        type: Date,
        default: Date.now,
      },
      status: {
        trim: true,
        default: 0,
        type: Number,
      },
    },
    { strict: 'throw', useCreateIndex: true },
  )

  return mongoose.model('tracking', trackingSchema)
}
