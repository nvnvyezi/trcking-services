module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.token.set)
  router.post('/login', controller.login.index)
}
