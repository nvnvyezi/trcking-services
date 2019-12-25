module.exports = app => {
  const { router, controller } = app
  router.get('/api', controller.token.set)
  router.post('/api/login', controller.login.index)
  router.post('/api/registry', controller.registry.index)
}
