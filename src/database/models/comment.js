'use strict'
module.exports = (sequelize, DataTypes) => {
  const models = sequelize.models
  const Comment = sequelize.define('mmComment', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    contributionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'mmComment',
    underscored: false
  })

  Comment.associate = models => {
    Comment.belongsTo(models.mmUser, {
      foreignKey: 'userId'
    })
  }

  Comment.getComments = async contributionId => {
    const comments = await Comment.findAll({
      where: {
        contributionId: contributionId
      },
      attributes: ['id', 'comment', 'contributionId', 'createdAt', 'updatedAt'],
      include: [{
        model: models.mmUser,
        attributes: {
          include: [
            [sequelize.fn('concat', sequelize.col('firstName'), ' ', sequelize.col('lastName')), 'fullName'],
            'userColor'
          ],
          exclude: ['id', 'firstName', 'lastName', 'lastLogin', 'createdAt', 'updatedAt']
        }
      }]
    })

    return [comments]
  }

  Comment.countComments = async contributionId => {
    const comments = await Comment.findAll({
      where: {
        contributionId: contributionId
      },
      attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'count']]
    })

    return comments
  }

  return Comment
}
