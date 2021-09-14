const { contribution } = require('../fakers')

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('mmContribution', contribution, {
      ignoreDuplicates: false
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('mmContribution', null, {})
  }
}
