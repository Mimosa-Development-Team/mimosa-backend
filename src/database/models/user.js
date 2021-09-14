'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'mmUser',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      orcidId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true
      },
      userColor: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.STRING,
        allowNull: true
      },
      notification: {
        type: DataTypes.BOOLEAN
      },
      emailNotification: {
        type: DataTypes.BOOLEAN
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn('NOW')
      },
      updatedAt: {
        type: DataTypes.DATE,
        onUpdate: sequelize.fn('NOW')
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: 'mmUser',
      underscored: false
    }
  )

  User.associate = (models) => {
    User.hasMany(models.mmRelatedMedia, {
      foreignKey: 'id'
    })
  }

  User.associate = (models) => {
    User.hasMany(models.mmComment, {
      foreignKey: 'id'
    })
  }

  User.associate = (models) => {
    User.belongsTo(models.mmContributionDraft, {
      foreignKey: 'id'
    })
  }

  User.getUsers = async () => {
    const users = await User.findAll({})
    const container = []
    users.forEach((result) => {
      let name = ''
      if (result.dataValues.lastName) {
        name =
          result.dataValues.firstName + ' ' + result.dataValues.lastName
      } else {
        name = result.dataValues.firstName
      }
      container.push({
        name,
        id: result.dataValues.id,
        userColor: result.dataValues.userColor
      })
    })

    return [container.sort()]
  }

  return User
}
