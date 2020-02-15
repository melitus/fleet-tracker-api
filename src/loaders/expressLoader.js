const csrf =  require( 'csurf')

const processApiEndpoints =  require( './routesLoader')
const installAllMiddlewares =  require( '../middlewares/middlewaresConfig')
const toobusy =  require( '../middlewares/toobusy')
const error =  require( '../middlewares/error')
const initSwagger =  require( '../swagger/swaggerMiddleware')
const initializeCaching =  require( '../middlewares/caching')
const addSecurityMiddleware =  require( '../middlewares/security')
const logger =  require( '../config/logger').gateway
const {passportLoader} =  require( './passportLoader')


exports.expressLoader = (app ) => {
  logger.info('SETUP - Installing Fleet Api Webserver...')
  app.set('trust proxy', true)

  app.use(toobusy)

  initializeCaching(app)
  installAllMiddlewares(app)
  passportLoader(app)
  addSecurityMiddleware(app, { enableNonce: false, enableCSP: false })
  if (process.env.NODE_ENV === 'production' && !process.env.FORCE_DEV) {
    app.use(csrf)
  }
  initSwagger(app)
  app.use('/', processApiEndpoints)
  app.use(error.converter)
  app.use(error.notFound)

  // Return the express app
  return app;
}