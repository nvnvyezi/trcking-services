module.exports = () => {
  return async function(ctx, next) {
    const { secret } = ctx.app.config.jwt
    const { authorization = '' } = ctx.request.header

    // if (!authorization) {
    //   ctx.
    // }

    try {
      ctx.app.jwt.verify(authorization.substring(7), secret)
    } catch (error) {
      console.log('errors', error.message)
      ctx.status = 401
      ctx.body = ctx.responseBody(false, { msg: 'invalid token' })
      return
    }
    console.log(authorization)
    console.time('report')
    await next()
    console.timeEnd('report')
  }
}
