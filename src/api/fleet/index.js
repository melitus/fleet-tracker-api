const fleetController = require('./fleet.controller')
const { authorize, ADMIN } = require('../../middlewares/auth')
const { createFleet, updateFleet } = require('./fleet.validation')
const validate = require('../../middlewares/validation')

module.exports = router => {
  router
    .route('/')
    .get(authorize(ADMIN), fleetController.getBrands)
    .post(authorize(ADMIN),validate.validateBodySchema(createFleet), fleetController.createBrand)
  router
    .route('/:fleetId')
    .get(authorize(ADMIN), fleetController.getOneBrand)
    .put(authorize(ADMIN), authorize(ADMIN),validate.validateBodySchema(updateFleet), fleetController.updateBrand)
    .delete(authorize(ADMIN), fleetController.deleteBrandById)

  // Finish by binding the products middleware
  router.param('fleetId', fleetController.load)
}
