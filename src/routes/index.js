const express = require('express');
const fleetRoutes = require('./fleet.route');
const authRoutes = require('./auth.route');
const verificationRoutes = require('./verify.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

router.use('/fleets', fleetRoutes);
router.use('/auth', authRoutes);
router.use('/verify', verificationRoutes);

module.exports = router;
