module.exports = app => {
  const { mongoose } = app
  const { Schema } = mongoose

  const AttributeSchema = new Schema(
    {
      name: {
        trim: true,
        index: true,
        unique: true,
        type: String,
        require: true,
      },
      type: {
        trim: true,
        type: String,
        required: true,
        default: 'string',
      },
      describe: {
        trim: true,
        type: String,
        require: true,
        default: '这是一个描述',
      },
      createTime: {
        type: Date,
        default: Date.now,
      },
      creator: {
        trim: true,
        default: '',
        type: String,
        require: true,
      },
      updater: {
        trim: true,
        default: '',
        type: String,
        require: true,
      },
    },
    { strict: 'throw', useCreateIndex: true },
  )

  return mongoose.model('attribute', AttributeSchema)
}
