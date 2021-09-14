const { users } = require('../fakers')

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('mmUser', users, {
      ignoreDuplicates: true
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('mmUser', null, {})
  }
}
