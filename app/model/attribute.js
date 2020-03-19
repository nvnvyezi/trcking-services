module.exports = app => {
  const { mongoose } = app
  const { Schema } = mongoose

  const AttributeSchema = new Schema({
    name: { type: String, unique: true, require: true, index: true },
    type: { type: String || Boolean || Number, required: true },
    describe: { type: String, require: true },
    createTime: { type: Date, default: Date.now },
    creator: { type: String, require: true },
    updater: { type: String },
  })

  return mongoose.model('attribute', AttributeSchema)
}
