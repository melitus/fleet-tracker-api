const express = require('express');
const validate = require('express-validation');

const controller = require('../controllers/fleet.controller');
const {
  listFleets,
  createFleet,
  replaceFleet
} = require('../validations/fleet.validation');

const {
  requireAuth,
} = require('../middlewares/auth');

const router = express.Router();

/**
 * Load Fleet when API with FleetId route parameter is hit
 */
router.param('fleetId', controller.load);

// [GET] List Fleets
router
  .route('/')
  .get( validate(listFleets), controller.getAllFleets)
  // [POST] Create Fleet
  .post(validate(createFleet), requireAuth, controller.createfleet);

// [GET] fleets/:id Get Fleet
router
  .route('/:fleetId')
  .get( controller.getfleetById)

  //[PUT] fleets/:id Replace Fleet
  .put( validate(replaceFleet), controller.updatefleet)
  // [PATCH] fleets/:id Update Fleet
  .delete( controller.deletefleetById);


module.exports = router;
