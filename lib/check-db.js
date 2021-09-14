#!/usr/bin/env node
const Sequelize = require('sequelize')

const config = require('../config')

const db = new Sequelize(config.db.database, config.db.username, config.db.password, {
  host: config.db.host,
  port: config.db.port,
  dialect: config.db.dialect,
  logging: false
})

async function checkDb (sequelizedDb) {
  try {
    await sequelizedDb.authenticate()
    console.log(`Connection to "${sequelizedDb.config.database}" database has been established successfully.`)
  } catch (error) {
    console.error(`Unable to connect to the "${sequelizedDb.config.database}" database:`, error.message)
  }
}

checkDb(db)
checkDb(db)
