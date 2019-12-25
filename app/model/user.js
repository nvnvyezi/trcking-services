module.exports = app => {
  const { mongoose } = app
  const { Schema } = mongoose

  const userSchema = new Schema({
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    admin: {
      type: Boolean,
    },
    email: {
      type: String,
    },
  })

  return mongoose.model('users', userSchema)
}
