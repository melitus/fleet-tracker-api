const authRoutes = require('../api/auth')
const fleetRoutes = require('../api/user')
const appRoutes = require('../api/app')

exports.processApiEndpoints = apiRouter => {
  apiRouter.use('/app', appRoutes)
  apiRouter.use('/auth', authRoutes)
  apiRouter.use('/fleet', fleetRoutes)
  }
