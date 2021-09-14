'use strict'
const fs = require('fs')
const path = require('path')
const sqlPath = path.resolve(__dirname, '..', 'sql', '009-sp-user-contribution-ctr.sql')

module.exports = {
  up: function (queryInterface, Sequelize) {
    const sql = fs.readFileSync(sqlPath, 'utf8')
    return queryInterface.sequelize.query(sql)
  },
  down: function (queryInterface) {
    return queryInterface.sequelize.query('DROP FUNCTION IF EXISTS get_user_contribution_ctr(paramuserid uuid)')
  }
}
