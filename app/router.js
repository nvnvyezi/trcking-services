module.exports = app => {
  const { router, controller } = app
  router.get('/api/v1', controller.token.set)
  router.get('/api/v1/tracking', controller.tracking.get)

  router.post('/api/v1/login', controller.login.index)
  router.post('/api/v1/registry', controller.registry.index)
  router.post('/api/v1/tracking', controller.tracking.create)
}
