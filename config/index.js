const path = require('path')
const helpers = require('../helpers')

require('dotenv').config()

const ENV = process.env.NODE_ENV || 'development'

const envConfig = require(path.join(__dirname, 'environments', ENV))

const config = Object.assign({
  ERROR_CODES: require('./error-codes'),
  db: helpers.loadDbConfig(ENV),
  env: ENV
}, envConfig)

module.exports = config
