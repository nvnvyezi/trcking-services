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
    team: {
      type: String,
    },
    enail: {
      type: String,
    },
  })

  return mongoose.model('users', userSchema)
}
