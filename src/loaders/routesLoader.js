const { Router } = require('express');

const userRoutes = require('../api/user')
const fleetRoutes = require('../api/fleet')

const apiRouter = Router()

apiRouter.use('/user', userRoutes)
apiRouter.use('/fleet', fleetRoutes)
  
module.exports = apiRouter