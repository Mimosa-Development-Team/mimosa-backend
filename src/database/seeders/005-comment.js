const { comment } = require('../fakers')

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('mmComment', comment, {
      ignoreDuplicates: true
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('mmComment', null, {})
  }
}
