'use strict'
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('mmNotification', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    poster: {
      type: DataTypes.UUID
    },
    user: {
      type: DataTypes.UUID
    },
    comment: {
      type: DataTypes.STRING
    },
    commentId: {
      type: DataTypes.INTEGER
    },
    type: {
      type: DataTypes.STRING
    },
    contributionId: {
      type: DataTypes.INTEGER
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW')
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW')
    }
  }, {
    tableName: 'mmNotification',
    underscored: false
  })

  Notification.associate = (models) => {
    Notification.belongsTo(models.mmUser, {
      foreignKey: 'user'
    })
  }

  return Notification
}
