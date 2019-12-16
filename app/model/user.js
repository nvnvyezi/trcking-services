module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

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
