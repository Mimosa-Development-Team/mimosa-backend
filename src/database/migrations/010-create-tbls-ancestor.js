'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('mmContributionsancestors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mmContributionId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      ancestorId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        onUpdate: Sequelize.fn('now')
      }
    })
  },
  down: (queryInterface, Sequelize) => queryInterface.dropTable('mmContributionsancestors')
}
