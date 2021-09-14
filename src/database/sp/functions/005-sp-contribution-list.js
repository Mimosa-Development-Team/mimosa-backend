'use strict'
const fs = require('fs')
const path = require('path')
const sqlPath = path.resolve(
  __dirname,
  '..',
  'sql',
  '005-sp-contribution-list.sql'
)

module.exports = {
  up: function (queryInterface, Sequelize) {
    const sql = fs.readFileSync(sqlPath, 'utf8')
    return queryInterface.sequelize.query(sql)
  },
  down: function (queryInterface) {
    return queryInterface.sequelize.query(
      'DROP FUNCTION IF EXISTS sp_get_contribution_list(contributionId uuid)'
    )
  }
}
