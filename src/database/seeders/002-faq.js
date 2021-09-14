const { faq } = require('../fakers')

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('mmFaq', faq, {
      ignoreDuplicates: true
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('mmFaq', null, {})
  }
}
