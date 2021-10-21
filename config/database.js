const path = require('path')

/**
 * This is to ensure that the .env file is being parsed
 * when this config file is called via terminal
 */
require('dotenv').config({
  path: path.resolve('.env')
})

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_TYPE,
    define: {
      underscored: true
    },
    dialectOptions: {
      useUTC: true,
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    timezone: '00:00' // --> for writing to database
  },
  test: {
    username: process.env.DB_USER_TEST,
    password: process.env.DB_PASS_TEST,
    database: process.env.DB_NAME_TEST,
    host: process.env.DB_HOST_TEST,
    port: process.env.DB_PORT_TEST,
    dialect: process.env.DB_TYPE_TEST,
    define: {
      underscored: true
    },
    dialectOptions: {
      useUTC: true // --> for reading from database
    },
    timezone: '00:00', // --> for writing to database,
    logging: false // remove logs
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_TYPE,
    define: {
      underscored: true
    },
    dialectOptions: {
      useUTC: true // --> for reading from database
    },
    timezone: '00:00' // --> for writing to database
  }
}
