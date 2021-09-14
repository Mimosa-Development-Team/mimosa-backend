const {
  mmContribution,
  mmContributionRelation,
  mmRelatedMedia,
  mmContributionDraft
} = require('../../database/models')
const { errorResponse, payloadValidator } = require('../../../helpers')

const validate = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(422).json({
        message: 'Nothing to create.'
      })
    }

    const payloadSchema = {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          maxLength: 26
        },
        subject: {
          type: 'string'
        },
        details: {
          type: 'string'
        },
        tags: {
          type: 'array'
        },
        author: {
          type: 'array'
        },
        userId: {
          type: 'string',
          maxLength: 40
        },
        status: {
          type: 'string',
          maxLength: 26
        },
        version: {
          type: 'string',
          maxLength: 26
        },
        parentId: {
          type: 'string',
          maxLength: 10
        },
        parentUuid: {
          type: 'string',
          maxLength: 40
        },
        hypothesisStatus: {
          type: 'string'
        },
        relatedMedia: {
          type: 'array'
        },
        method: {
          type: 'string'
        }
      },
      required: [
        'userId',
        'category',
        'subject',
        'details',
        'tags',
        'author',
        'status',
        'version'
      ]
    }

    const payloadData = {
      category: req.body.category,
      subject: req.body.subject,
      details: req.body.details,
      tags: req.body.tags,
      author: req.body.author,
      userId: req.body.userId,
      status: req.body.status,
      version: req.body.version,
      hypothesisStatus: req.body.hypothesisStatus
    }

    const payloadValid = payloadValidator(payloadSchema, payloadData)

    if (payloadValid !== true) {
      res.status(422).json({
        message: payloadValid
      })
    }
    let findAllRelation = null
    if (req.body.category !== 'question') {
      findAllRelation = await mmContributionRelation.findAll({
        where: {
          parentQuestionUuid: req.body.parentQuestionUuid
        }
      })
    }

    req.allContribution = findAllRelation

    req.payload = payloadData
    const relatedMediapayloadData = []
    if (req.body.relatedMedia) {
      for (let i = 0; i < req.body.relatedMedia.length; i++) {
        const relatedMediaData = {}
        if (!req.body.relatedMedia[i].id) {
          if (req.body.relatedMedia[i].conferenceName) {
            relatedMediaData.conferenceName =
              req.body.relatedMedia[i].conferenceName
            relatedMediaData.conferenceDateDetails =
              req.body.relatedMedia[i].conferenceDateDetails
          }
          if (req.body.relatedMedia[i].title) {
            relatedMediaData.mediaDetails = {
              title: req.body.relatedMedia[i].title,
              link: req.body.relatedMedia[i].link
            }
          }
        }

        relatedMediapayloadData.push(relatedMediaData)
      }
    }

    req.relatedMediapayloadData = relatedMediapayloadData

    return next()
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

const create = async (req, res, next) => {
  try {
    if (req.body.method === 'new') {
      req.payload.updatedAt = Date.now()
      const newContribution = await mmContribution.create(req.payload)
      if (req.payload.status === 'draft') {
        const draftPayload = newContribution.dataValues
        if (req.body.category !== 'question') {
          draftPayload.parentQuestionUuid = req.body.parentQuestionUuid
        } else {
          draftPayload.id = newContribution.dataValues.id
        }
        await mmContributionDraft.create(draftPayload)
      } else {
        if (req.allContribution) {
          for (let i = 0; i < req.allContribution.length; i++) {
            if (req.body.category === 'hypothesis') {
              for (let i = 0; i < req.allContribution.length; i++) {
                const fetchContribution = await mmContribution.findOne({
                  where: {
                    id: req.allContribution[i].dataValues.contribChildId
                  }
                })

                if (fetchContribution.dataValues.category === 'question') {
                  const findDraft = await mmContributionDraft.findOne({
                    where: {
                      id: fetchContribution.dataValues.id
                    }
                  })

                  if (findDraft) {
                    findDraft.dataValues.status = 'publish'
                    await mmContribution.update(findDraft.dataValues, {
                      where: {
                        id: fetchContribution.dataValues.id
                      }
                    })

                    await findDraft.destroy({
                      where: {
                        id: fetchContribution.dataValues.id
                      }
                    })
                  }
                }
              }
            }

            if (req.body.category === 'experiment') {
              for (let i = 0; i < req.allContribution.length; i++) {
                const fetchContribution = await mmContribution.findOne({
                  where: {
                    id: req.allContribution[i].dataValues.contribChildId
                  }
                })

                if (
                  fetchContribution.dataValues.category === 'question' ||
                  fetchContribution.dataValues.category === 'hypothesis'
                ) {
                  const findDraft = await mmContributionDraft.findOne({
                    where: {
                      id: fetchContribution.dataValues.id
                    }
                  })
                  if (findDraft) {
                    findDraft.dataValues.status = 'publish'
                    await mmContribution.update(findDraft.dataValues, {
                      where: {
                        id: fetchContribution.dataValues.id
                      }
                    })

                    await findDraft.destroy({
                      where: {
                        id: fetchContribution.dataValues.id
                      }
                    })
                  }
                }
              }
            }

            if (req.body.category === 'data') {
              for (let i = 0; i < req.allContribution.length; i++) {
                const fetchContribution = await mmContribution.findOne({
                  where: {
                    id: req.allContribution[i].dataValues.contribChildId
                  }
                })

                if (
                  fetchContribution.dataValues.category !== 'analysis' ||
                  fetchContribution.dataValues.category !== 'data'
                ) {
                  const findDraft = await mmContributionDraft.findOne({
                    where: {
                      id: fetchContribution.dataValues.id
                    }
                  })
                  if (findDraft) {
                    findDraft.dataValues.status = 'publish'
                    await mmContribution.update(findDraft.dataValues, {
                      where: {
                        id: fetchContribution.dataValues.id
                      }
                    })

                    await findDraft.destroy({
                      where: {
                        id: fetchContribution.dataValues.id
                      }
                    })
                  }
                }
              }
            }
            if (req.body.category === 'analysis') {
              for (let i = 0; i < req.allContribution.length; i++) {
                const fetchContribution = await mmContribution.findOne({
                  where: {
                    id: req.allContribution[i].dataValues.contribChildId
                  }
                })

                if (fetchContribution.dataValues.category !== 'analysis') {
                  const findDraft = await mmContributionDraft.findOne({
                    where: {
                      id: fetchContribution.dataValues.id
                    }
                  })

                  if (findDraft) {
                    findDraft.dataValues.status = 'publish'
                    if (findDraft.dataValues.userId === req.payload.userId) {
                      await mmContribution.update(findDraft.dataValues, {
                        where: {
                          id: fetchContribution.dataValues.id
                        }
                      })

                      await findDraft.destroy({
                        where: {
                          id: fetchContribution.dataValues.id
                        }
                      })
                    }
                  }
                }
              }
            }
          }
        }
      }

      req.data = {
        data: newContribution.dataValues
      }

      for (let i = 0; i < req.relatedMediapayloadData.length; i++) {
        req.relatedMediapayloadData[i].contributionId =
          newContribution.dataValues.id
        req.relatedMediapayloadData[i].userId =
          newContribution.dataValues.userId
      }

      const contributionRelationData = req.body.parentId
        ? {
            contribParentId: req.body.parentId,
            contribChildId: newContribution.dataValues.id,
            parentQuestionUuid: req.body.parentUuid
          }
        : {
            contribParentId: 0,
            contribChildId: newContribution.dataValues.id,
            parentQuestionUuid: newContribution.dataValues.uuid
          }

      const newContributionRelation = await mmContributionRelation.create(
        contributionRelationData
      )

      req.contribution = {
        contribution: newContributionRelation.dataValues
      }

      const newMmRelationMedia = await mmRelatedMedia.bulkCreate(
        req.relatedMediapayloadData
      )

      req.relatedMedia = {
        relatedMedia: newMmRelationMedia.dataValues
      }
    }

    return next()
  } catch (error) {
    // TODO: Create a better error handling for sequelize validation errors
    if (
      error.name === 'SequelizeUniqueConstraintError' &&
      error.message === 'Validation error'
    ) {
      return res.status(409).json({ message: error.errors[0].message })
    }

    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

const response = async (req, res) => {
  try {
    res.status(201).json({
      data: req.data.data,
      relatedMedia: req.relatedMedia.relatedMedia,
      contribution: req.contribution.contribution
    })
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

module.exports = {
  validate,
  create,
  response
}
