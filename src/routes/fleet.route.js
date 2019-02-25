const express = require('express');
const validate = require('express-validation');

const controller = require('../controllers/fleet.controller');
const {
  listFleets,
  createFleet,
  replaceFleet,
  updateFleet,
} = require('../validations/fleet.validation');

const router = express.Router();

/**
 * Load Fleet when API with FleetId route parameter is hit
 */
router.param('fleetId', controller.load);

// [GET] v1/Fleets List Fleets
router
  .route('/')
  .get( validate(listFleets), controller.list)
  // [POST] v1/Fleets Create Fleet
  .post(validate(createFleet), controller.create);

// [GET] v1/Fleets/:id Get Fleet
router
  .route('/:fleetId')
  .get( controller.get)

  //[PUT] v1/Fleets/:id Replace Fleet, Replace the whole Fleet document with a new one
  .put( validate(replaceFleet), controller.replace)
  // [PATCH] v1/Fleets/:id Update Fleet, Update some fields of a Fleet document
  .patch( validate(updateFleet), controller.update)
  // [DELETE] v1/Fleets/:id Delete Fleet
  .delete( controller.remove);


module.exports = router;
