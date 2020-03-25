const API = require('../constant/api')

module.exports = app => {
  const { router, controller } = app

  router.get('/api/v1', controller.token.set)
  router.post('/api/v1/login', controller.login.index)
  router.post('/api/v1/registry', controller.registry.index)

  router.get(API.tracking, controller.tracking.get)
  router.post(API.tracking, controller.tracking.create)
  router.delete(API.tracking, controller.tracking.delete)

  router.get(API.attribute, controller.attribute.get)
  router.post(API.attribute, controller.attribute.create)
  router.patch(API.attribute, controller.attribute.update)
  router.delete(API.attribute, controller.attribute.delete)
}
