const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

let options = {
  explorer: true,
  swaggerOptions: {
    docExpansion: 'none'
  },
  customSiteTitle: 'Connetmi api',
  customCss:
    '.swagger-ui .topbar { background: linear-gradient(135deg, #44b5af 0%,#009FE3 100%)} '
  // customCssUrl:'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-newspaper.css'
}
module.exports = app => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, options)
  )
}
