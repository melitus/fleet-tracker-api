const fleetController = require('./fleet.controller')
const { authorize, ADMIN } = require('../../middlewares/auth')
const { createFleet, updateFleet } = require('./fleet.validation')
const validate = require('../../middlewares/validation')

module.exports = router => {
  router
    .route('/')
    .get(authorize(ADMIN), fleetController.getAllfleets)
    .post(authorize(ADMIN),validate.validateBodySchema(createFleet), fleetController.createFleet)
  router
    .route('/:fleetId')
    .get(authorize(ADMIN), fleetController.getSinglefleet)
    .put(authorize(ADMIN), authorize(ADMIN),validate.validateBodySchema(updateFleet), fleetController.updatefleet)
    .delete(authorize(ADMIN), fleetController.deletefleets)

  // Finish by binding the products middleware
  router.param('fleetId', fleetController.load)
}
