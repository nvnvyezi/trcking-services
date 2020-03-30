module.exports = app => {
  const { mongoose } = app
  const { Schema } = mongoose

  const userSchema = new Schema(
    {
      username: {
        trim: true,
        index: true,
        unique: true,
        type: String,
        require: true,
      },
      password: {
        trim: true,
        type: String,
        require: true,
      },
      admin: {
        type: Boolean,
        require: true,
        default: false,
      },
      email: {
        trim: true,
        type: String,
        default: '',
      },
    },
    { strict: 'throw' },
  )

  return mongoose.model('users', userSchema)
}
