'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('mmRelatedMedia', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      conferenceName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      conferenceDateDetails: {
        type: Sequelize.JSON,
        allowNull: true
      },
      mediaDetails: {
        type: Sequelize.JSON,
        allowNull: true
      },
      contributionId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      userId: {
        type: Sequelize.UUID,
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('mmRelatedMedia')
  }
}
