'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('mmNotification', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      poster: {
        type: Sequelize.UUID
      },
      user: {
        type: Sequelize.UUID
      },
      comment: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      commentId: {
        type: Sequelize.INTEGER
      },
      contributionId: {
        type: Sequelize.INTEGER
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('mmNotification')
}
