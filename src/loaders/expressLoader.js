const csrf =  require( 'csurf')

const {processApiEndpoints} =  require( './routesLoader')
const installAllMiddlewares =  require( '../middlewares/middlewaresConfig')
const toobusy =  require( '../middlewares/toobusy')
const error =  require( '../middlewares/error')
const initSwagger =  require( '../swagger/swaggerMiddleware')
const initializeCaching =  require( '../middlewares/caching')
const addSecurityMiddleware =  require( '../middlewares/security')
const logger =  require( './winstonLoader')
const {passportLoader} =  require( './passportLoader')
const {publicLoader} =  require( './publicLoader')
const device =  require( 'express-device')
const requestIp = require('request-ip')


exports.expressLoader = async (app ) => {
  logger.info('SETUP - Installing Ngmetro Webserver...')
  app.set('trust proxy', true)

  app.use(device.capture());
  app.use(toobusy)

  await initializeCaching(app)
  await installAllMiddlewares(app)
  await passportLoader(app)
  await publicLoader(app)
  await addSecurityMiddleware(app, { enableNonce: false, enableCSP: false })
  if (process.env.NODE_ENV === 'production' && !process.env.FORCE_DEV) {
    app.use(csrf)
  }
  await initSwagger(app)
  app.use('/', processApiEndpoints(app))
  app.use(error.converter)
  app.use(error.notFound)
  app.use(error.developmentErrors)
  app.use(error.productionErrors)
  // Return the express app
  return app;
}