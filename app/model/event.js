module.exports = app => {
  const { mongoose } = app
  const { Schema } = mongoose

  const eventSchema = new Schema(
    {
      deviceId: {
        trim: true,
        type: String,
      },
      event: {
        trim: true,
        type: String,
        require: true,
      },
      url: {
        trim: true,
        type: String,
        default: '',
      },
      system: {
        trim: true,
        type: String,
        require: true,
        default: 'ios',
      },
      ip: {
        trim: true,
        type: String,
        default: '--',
      },
      demand: {
        trim: true,
        type: String,
        require: true,
      },
      country: {
        trim: true,
        type: String,
        default: '--',
      },
      province: {
        trim: true,
        type: String,
        default: '--',
      },
      city: {
        trim: true,
        type: String,
        default: '--',
      },
      createTime: {
        type: Date,
        default: Date.now,
      },
      useragent: {
        trim: true,
        type: String,
        default: '--',
      },
      params: {
        trim: true,
        type: String,
        require: true,
        default: '--',
      },
    },
    {
      strict: 'throw',
      useCreateIndex: true,
    },
  )

  return mongoose.model('event', eventSchema)
}
