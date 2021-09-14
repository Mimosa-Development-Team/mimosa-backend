const fs = require('fs')
const path = require('path')
const configDatabase = require('../config/database')

function loadDbConfig (NODE_ENV) {
  if (fs.existsSync(path.join(__dirname, '../config/database.js'))) {
    return configDatabase[NODE_ENV]
  }

  throw new Error('Database configuration is required')
}

module.exports = loadDbConfig
