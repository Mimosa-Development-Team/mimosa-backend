const { contributionRelation } = require('../fakers')

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('mmContributionRelation', contributionRelation, {
      ignoreDuplicates: true
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('mmContributionRelation', null, {})
  }
}
