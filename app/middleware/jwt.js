module.exports = () => {
  return async function(ctx, next) {
    const { secret } = ctx.app.config.jwt
    const { expires } = ctx.app.config.redis
    const { authorization = '' } = ctx.request.header
    const token = authorization.substring(7)

    try {
      ctx.app.jwt.verify(token, secret)
    } catch (error) {
      /** 判断toekn是否过期 */
      const decodeData = ctx.app.jwt.decode(token)
      if (!decodeData) {
        ctx.status = 401
        ctx.body = ctx.responseBody(false, { msg: 'invalid token' })
        return
      }
      const { username } = decodeData
      const redisUsername = await ctx.app.redis.get(username)
      if (username === redisUsername) {
        await ctx.app.redis.pexpireat(username, expires)
        const token = ctx.app.jwt.sign(
          {
            iss: 'liliye',
            sub: 'buried-point-management',
            username,
          },
          secret,
        )
        ctx.set({
          Authorization: `bearer ${token}`,
        })
      }
    }
    console.time('report')
    await next()
    console.timeEnd('report')
  }
}
