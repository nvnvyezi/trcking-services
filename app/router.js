const API = require('../constant/api')

module.exports = app => {
  const { router, controller } = app

  router.get('/api/v1', controller.token.set)

  /** register */
  router.post(API.register, controller.registry.index)

  /** login */
  router.post(API.login, controller.login.index)

  /** user */
  router.get(API.user, controller.user.getAllUser)
  router.patch(API.user, controller.user.update)
  router.delete(API.user, controller.user.delete)

  router.get(API.userStatus, controller.user.getUserStatus)
  router.delete(API.userStatus, controller.user.delUserStatus)

  router.patch(API.userAdmin, controller.user.updateAdmin)

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
