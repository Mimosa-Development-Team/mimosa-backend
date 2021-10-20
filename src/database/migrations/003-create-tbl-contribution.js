'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('mmContribution', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        uniqueKey: true,
        allowNull: false
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      subject: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      details: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      tags: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      author: {
        type: Sequelize.JSON,
        allowNull: false
      },
      userId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
      },
      version: {
        type: Sequelize.STRING,
        allowNull: false
      },
      hypothesisStatus: {
        type: Sequelize.STRING,
        allowNull: true
      },
      parentId: {
        type: Sequelize.INTEGER
      },
      mainParentId: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      searchString: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    })
  },
  down: (queryInterface, Sequelize) => queryInterface.dropTable('mmContribution')
}
