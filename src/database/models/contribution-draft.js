('use strict')
module.exports = (sequelize, DataTypes) => {
  // const models = sequelize.models
  const Contribution = sequelize.define(
    'mmContributionDraft',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        uniqueKey: true,
        allowNull: false
      },
      parentQuestionUuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false
      },
      subject: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: true
      },
      author: {
        type: DataTypes.JSON,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      version: {
        type: DataTypes.STRING,
        allowNull: false
      },
      hypothesisStatus: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.fn('NOW')
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.fn('NOW')
      }
    },
    {
      tableName: 'mmContributionDraft',
      underscored: false
    }
  )

  Contribution.associate = (models) => {
    Contribution.hasOne(models.mmContribution, {
      foreignKey: 'id'
    })
  }

  Contribution.associate = (models) => {
    Contribution.belongsTo(models.mmUser, {
      foreignKey: 'userId'
    })
  }

  Contribution.getQuestions = async (userId, orderBy) => {
    // const questions = await Contribution.findAll({
    //   where: {
    //     userId: userId
    //   },
    //   include: [{
    //     model: models.mmUser,
    //     attributes: {
    //       include: [
    //         [sequelize.fn('concat', sequelize.col('firstName'), ' ', sequelize.col('lastName')), 'fullName'],
    //         'userColor'
    //       ],
    //       exclude: ['userId', 'id', 'firstName', 'lastName', 'lastLogin', 'createdAt', 'updatedAt', 'role', 'orcidId']
    //     }
    //   }]
    // })

    // return [questions]
    const query = `SELECT * FROM sp_draft_contributions('${userId}', '${orderBy}')`

    return sequelize.query(query, { raw: true })
  }

  return Contribution
}
