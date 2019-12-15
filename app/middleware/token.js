module.exports = () => {
  return async function(cyx, next) {
    console.time('report')
    await next()
    console.timeEnd('report')
  }
}
