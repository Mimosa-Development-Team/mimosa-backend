('use strict')
const sequelizePaginate = require('sequelize-paginate')
module.exports = (sequelize, DataTypes) => {
  const Contribution = sequelize.define(
    'mmContribution',
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
        type: DataTypes.JSONB,
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
      searchString: {
        type: DataTypes.STRING,
        allowNull: false
      },
      parentId: {
        type: DataTypes.INTEGER
      },
      mainParentId: {
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
    },
    {
      tableName: 'mmContribution',
      underscored: false,
      updatedAt: false,
      createdAt: false
    }
  )
  sequelizePaginate.paginate(Contribution)
  Contribution.associate = (models) => {
    Contribution.belongsTo(models.mmUser, {
      foreignKey: 'userId',
      as: 'poster'
    })
    Contribution.hasMany(models.mmComment, {
      foreignKey: 'contributionId',
      as: 'commentCount'
    })
    Contribution.hasMany(models.mmRelatedMedia, {
      foreignKey: 'contributionId',
      as: 'relatedMediaCount'
    })
    Contribution.hasMany(models.mmRelatedMedia, {
      foreignKey: 'contributionId',
      as: 'relatedmedia'
    })
    Contribution.hasOne(models.mmContributionDraft, {
      foreignKey: 'id',
      as: 'draft'
    })
    Contribution.hasMany(Contribution, {
      foreignKey: 'parentId',
      as: 'children'
    })
    Contribution.hasMany(Contribution, {
      foreignKey: 'mainParentId',
      as: 'total'
    })
  }

  Contribution.getQuestions = async (orderBy) => {
    const query = `SELECT * FROM sp_get_contribution_questions('${orderBy}')`

    return sequelize.query(query, { raw: true })
  }

  Contribution.getUserQuestion = (userId, orderBy) => {
    const query = `SELECT * FROM sp_get_user_question('${userId}', '${orderBy}')`

    return sequelize.query(query, { raw: true })
  }

  Contribution.getUserContributionCtr = (userId) => {
    const query = `SELECT * FROM get_user_contribution_ctr('${userId}')`

    return sequelize.query(query, { raw: true })
  }

  Contribution.getContributionSearch = async (data) => {
    const query = `SELECT * FROM get_search_contribution('${data}')`
    return sequelize.query(query, { raw: true })
  }

  Contribution.getContributionList = async (contributionId, userId) => {
    const query = `SELECT * FROM sp_get_contribution_list('${contributionId}')`

    const contributionList = await sequelize
      .query(query, { type: sequelize.QueryTypes.SELECT })
      .then(async (result) => {
        const map = {}
        let node
        const roots = []
        let i

        for (i = 0; i < result.length; i += 1) {
          map[result[i].id] = i // initialize the map
          result[i].children = [] // initialize the children
          result[i].draft = null // initialize draft
        }

        for (i = 0; i < result.length; i += 1) {
          node = result[i]
          const nodeQuery = `SELECT * FROM "mmContributionDraft" WHERE "id"::int=${node.id}`
          const fetchNode = await sequelize.query(nodeQuery, { raw: true })

          if (fetchNode && fetchNode.length > 0 && userId === node.userId && userId) {
            if (fetchNode[0][0] && fetchNode[0][0].id) {
              result[i].draft = fetchNode[0][0]
            }
          }
          if (node.contribParentId !== 0) {
            if (node.status === 'draft' && node.userId === userId && userId) {
              result[map[node.contribParentId]].children.push(node)
            }
            if (node.status === 'publish' || node.status === 'deprecated') {
              result[map[node.contribParentId]].children.push(node)
            }
          } else {
            roots.push(node)
          }
        }
        return roots
      })

    return contributionList
  }

  Contribution.getContributionTags = async () => {
    const tags = await Contribution.findAll({
      attributes: ['tags']
    })

    const container = []
    tags.forEach((result) => {
      result.dataValues.tags.forEach((tagArray) => {
        if (!container.includes(tagArray)) {
          container.push(tagArray)
        }
      })
    })

    return [container.sort()]
  }

  return Contribution
}
