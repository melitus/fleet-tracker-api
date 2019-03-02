const express = require('express');
const validate = require('express-validation');

const controller = require('../controllers/fleet.controller');
const {
  listFleets,
  createFleet,
  updateFleet
} = require('../validations/fleet.validation');
const {
  requireJWT,
} = require('../middlewares/auths');
const { authorize, ADMIN, LOGGED_USER } = require('../middlewares/auth');

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
  .post(validate(createFleet),authorize(ADMIN), controller.createfleet);

// [GET] fleets/:id Get Fleet
router
  .route('/:fleetId')
  .get( controller.getfleetById)

  //[PUT] fleets/:id Replace Fleet
  .put( validate(updateFleet), controller.updatefleet)
  // [DELETE] fleets/:id Delete Fleet
  .delete( controller.deletefleetById);


module.exports = router;
