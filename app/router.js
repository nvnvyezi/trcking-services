const API = require('../constant/api')

module.exports = app => {
  const { router, controller } = app

  router.get('/api/v1', controller.token.set)
  router.post('/api/v1/login', controller.login.index)
  router.post('/api/v1/registry', controller.registry.index)

  /** user */
  router.get(API.userStatus, controller.user.getUserStatus)
  router.delete(API.userStatus, controller.user.delUserStatus)

  /** attribute */
  router.get(API.attribute, controller.attribute.get)
  router.post(API.attribute, controller.attribute.create)
  router.patch(API.attribute, controller.attribute.update)
  router.delete(API.attribute, controller.attribute.delete)

  /** tracking */
  router.get(API.tracking, controller.tracking.get)
  router.post(API.tracking, controller.tracking.create)
  router.patch(API.tracking, controller.tracking.update)
  router.delete(API.tracking, controller.tracking.delete)

  router.get(API.trackingVersion, controller.tracking.getAllVersion)
  router.patch(API.trackingStatus, controller.tracking.updateStatus)
  router.patch(API.trackingBatch, controller.tracking.updateBatchStatus)
}
