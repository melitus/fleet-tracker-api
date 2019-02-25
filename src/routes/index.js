const express = require('express');
const fleetRoutes = require('./fleet.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

router.use('/fleets', fleetRoutes);


module.exports = router;
