const { contributionDraft } = require('../fakers')

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('mmContributionDraft', contributionDraft, {
      ignoreDuplicates: false
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('mmContributionDraft', null, {})
  }
}
