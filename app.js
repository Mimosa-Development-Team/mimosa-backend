const express = require('express')
const bodyParser = require('body-parser')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const compression = require('compression')
const path = require('path')
const passport = require('passport')
const helmet = require('helmet')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const routes = require('./src/routes')
const auth = require('./src/services/passport.service')()

const app = express()

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MIMOSA API SWAGGER DOCUMENTATION',
      version: '1.0.0'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'https',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]

  },
  apis: ['./src/routes/*/index.js'] // files containing annotations as above
}

const specs = swaggerJsdoc(options)

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
)

app.use(logger('dev'))
app.use(helmet())
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(cookieParser())
app.use(
  cors({
    origin: [
      'http://localhost:8080',
      'http://localhost:3000',
      'https://mimosa.offshorly.com',
      'https://openmimosa.org',
      'https://mimosa-staging.netlify.app',
      'https://609a150cbeffec6d6fc2872a--mimosa-app.netlify.app',
      'http://127.0.0.1:3000'
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'DNT',
      'X-CustomHeader',
      'Keep-Alive',
      'User-Agent',
      'X-Requested-With',
      'If-Modified-Since',
      'Cache-Control',
      'Content-Type',
      'Content-Range',
      'Range',
      'Authorization'
    ],
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
)
app.use(compression({ threshold: 0 })) // Set threshold to 0 to activate the gzip
app.use(auth.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'logo')))
app.use('/api/v1', routes)

// TODO: Swagger Docs
// require('./lib/swagger-options')(app)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Resource not found.' })
})

// error handler
app.use((error, req, res) => {
  // set locals, only providing error in development
  res.locals.message = error.message
  res.locals.error = req.app.get('env') === 'development' ? error : {}

  // render the error page
  res.status(error.status || 500).json({ message: error.message })
})

module.exports = app
