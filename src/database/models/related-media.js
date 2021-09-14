'use strict'
module.exports = (sequelize, DataTypes) => {
  const models = sequelize.models
  const RelatedMedia = sequelize.define(
    'mmRelatedMedia',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      conferenceName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      conferenceDateDetails: {
        type: DataTypes.JSON,
        allowNull: true
      },
      mediaDetails: {
        type: DataTypes.JSON,
        allowNull: true
      },
      contributionId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      }
    },
    {
      tableName: 'mmRelatedMedia',
      underscored: false
    }
  )

  RelatedMedia.associate = (models) => {
    RelatedMedia.belongsTo(models.mmUser, {
      foreignKey: 'userId'
    })
  }

  RelatedMedia.getList = async (contributionId) => {
    const questions = await RelatedMedia.findAll({
      where: {
        contributionId: contributionId
      }
    })

    const arr = questions
    const questionData = []
    arr.map((x) => {
      return questionData.push({
        conferenceName: x.dataValues.conferenceName
          ? x.dataValues.conferenceName
          : null,
        startTime: x.dataValues.conferenceDateDetails
          ? x.dataValues.conferenceDateDetails.startTime
          : null,
        endTime: x.dataValues.conferenceDateDetails
          ? x.dataValues.conferenceDateDetails.endTime
          : null,
        presentationDetails: x.dataValues.conferenceDateDetails
          ? x.dataValues.conferenceDateDetails.presentationDetails
          : null,
        title: x.dataValues.mediaDetails
          ? x.dataValues.mediaDetails.title
          : null,
        link: x.dataValues.mediaDetails ? x.dataValues.mediaDetails.link : null,
        id: x.dataValues.id
      })
    })

    return [questionData]
  }

  RelatedMedia.getRelatedMedia = async (contributionId) => {
    const ret = {}
    const relatedMedias = await RelatedMedia.findAll({
      where: {
        contributionId: contributionId
      },
      include: [models.mmUser]
    }).then(async (result) => {
      ret.conference = []
      ret.media = []
      let i
      for (i = 0; i < result.length; i += 1) {
        const media = result[i].dataValues
        if (
          media.conferenceName !== null &&
          media.conferenceDateDetails !== null
        ) {
          ret.conference.push({
            id: media.id,
            conferenceName: media.conferenceName,
            conferenceDateDetails: media.conferenceDateDetails,
            userFullName:
              media.mmUser.firstName + ' ' + media.mmUser.lastName
                ? media.mmUser.lastName
                : ''
          })
        }
        if (media.mediaDetails !== null) {
          ret.media.push({
            id: media.id,
            mediaDetails: media.mediaDetails,
            userFullName:
              media.mmUser.firstName + ' ' + media.mmUser.lastName
                ? media.mmUser.lastName
                : ''
          })
        }
      }

      return ret
    })

    return [relatedMedias]
  }

  RelatedMedia.countRelatedMedia = async (contributionId) => {
    const relatedMedias = await RelatedMedia.findAll({
      where: {
        contributionId: contributionId
      },
      attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'count']]
    })

    return relatedMedias
  }

  return RelatedMedia
}
