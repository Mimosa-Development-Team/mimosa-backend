const {
  mmContribution,
  mmRelatedMedia,
  mmContributionRelation,
  mmContributionDraft
} = require('../../database/models')
const {
  errorResponse,
  payloadValidator,
  cleanObject
} = require('../../../helpers')

const validatePayload = async (req, res, next) => {
  try {
    const contribution =
      req.body.status === 'publish'
        ? await mmContribution.findByPk(req.params.contributionId)
        : await mmContributionDraft.findByPk(req.params.contributionId)

    const findUuid = await mmContributionRelation.findOne({
      where: {
        contribChildId: req.params.contributionId
      }
    })

    const findAllRelation = await mmContributionRelation.findAll({
      where: {
        parentQuestionUuid: findUuid.dataValues.parentQuestionUuid
      }
    })

    req.allContribution = findAllRelation

    if (contribution === undefined) {
      return res.status(404).json({
        message: 'Contribution Not Found'
      })
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(422).json({
        message: 'Nothing to update.'
      })
    }

    const payloadSchema = {
      type: 'object',
      properties: {
        id: {
          type: ['string', 'null'],
          maxLength: 26
        },
        uuid: {
          type: ['string', 'null']
        },
        category: {
          type: ['string', 'null'],
          maxLength: 26
        },
        subject: {
          type: ['string', 'null']
        },
        details: {
          type: ['string', 'null']
        },
        tags: {
          type: ['array', 'null']
        },
        author: {
          type: ['array', 'null']
        },
        userId: {
          type: ['string', 'null'],
          maxLength: 60
        },
        version: {
          type: ['string', 'null'],
          maxLength: 10
        },
        hypothesisStatus: {
          type: ['string', 'null'],
          maxLength: 26
        },
        status: {
          type: ['string', 'null'],
          maxLength: 26
        },
        contributionId: {
          type: ['string', 'null'],
          maxLength: 36
        },
        parentQuestionUuid: {
          type: ['string', 'null']
        }
      }
    }

    const payloadData = {
      category: req.body.category,
      subject: req.body.subject,
      details: req.body.details,
      tags: req.body.tags,
      author: req.body.author,
      userId: req.body.userId,
      version: req.body.version,
      hypothesisStatus: req.body.hypothesisStatus,
      status: req.body.status,
      uuid: req.body.uuid,
      parentQuestionUuid: req.body.parentQuestionUuid
    }

    const payloadValid = payloadValidator(payloadSchema, payloadData)

    if (payloadValid !== true) {
      res.status(422).json({
        message: payloadValid
      })
    }

    const relatedMediapayloadData = []
    const relatedMediaUpdatePayload = []
    const relatedMediaDeletePayload = []
    for (let i = 0; i < req.body.relatedMedia.length; i++) {
      if (req.body.relatedMedia[i].id) {
        const relatedMediaData = {}
        relatedMediaData.contributionId = req.body.id
        relatedMediaData.userId = req.body.userId
        relatedMediaData.id = req.body.relatedMedia[i].id

        if (
          req.body.relatedMedia[i].conferenceName &&
          req.body.relatedMedia[i].conferenceDateDetails.startTime &&
          req.body.relatedMedia[i].conferenceDateDetails.endTime
        ) {
          relatedMediaData.conferenceName =
            req.body.relatedMedia[i].conferenceName
          relatedMediaData.conferenceDateDetails =
            req.body.relatedMedia[i].conferenceDateDetails
        }

        if (
          req.body.relatedMedia[i].conferenceName === '' &&
          req.body.relatedMedia[i].conferenceDateDetails.startTime === '' &&
          req.body.relatedMedia[i].conferenceDateDetails.endTime === ''
        ) {
          relatedMediaDeletePayload.push(req.body.relatedMedia[i].id)
        }

        if (req.body.relatedMedia[i].title && req.body.relatedMedia[i].link) {
          relatedMediaData.mediaDetails = {
            title: req.body.relatedMedia[i].title,
            link: req.body.relatedMedia[i].link
          }
        }
        if (
          req.body.relatedMedia[i].title === '' &&
          req.body.relatedMedia[i].link === ''
        ) {
          relatedMediaDeletePayload.push(req.body.relatedMedia[i].id)
        }
        relatedMediaUpdatePayload.push(relatedMediaData)
      }
      if (!req.body.relatedMedia[i].id) {
        const relatedMediaData = {}
        relatedMediaData.contributionId = req.body.id
        relatedMediaData.userId = req.body.userId

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
        relatedMediapayloadData.push(relatedMediaData)
      }
    }

    req.relatedMediaDeletePayload = relatedMediaDeletePayload
    req.relatedMediapayloadData = relatedMediapayloadData
    req.relatedMediaUpdatePayload = relatedMediaUpdatePayload

    req.contribution = contribution
    req.payload = cleanObject(payloadData)

    return next()
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

const update = async (req, res, next) => {
  try {
    if (req.body.status === 'publish' && req.contribution.dataValues.id) {
      if (req.body.category === 'question') {
        for (let i = 0; i < req.allContribution.length; i++) {
          const fetchContribution = await mmContribution.findOne({
            where: {
              id: req.allContribution[i].dataValues.contribChildId
            }
          })

          if (fetchContribution.dataValues.category !== 'question') {
            const contrib = fetchContribution.dataValues
            if (contrib.status !== 'draft') {
              contrib.status = 'deprecated'

              await mmContribution.update(
                {
                  status: 'deprecated'
                },
                {
                  where: {
                    id: fetchContribution.dataValues.id
                  }
                }
              )
            }
          } else {
            // Update createdAt field to current time if contribution is from draft status to publish
            if (fetchContribution.dataValues.status === 'draft') {
              await mmContribution.update(
                {
                  status: 'publish',
                  createdAt: Date.now(),
                  updatedAt: Date.now()
                },
                {
                  where: {
                    id: fetchContribution.dataValues.id
                  }
                }
              )
            } else {
              const contrib = fetchContribution.dataValues
              contrib.status = 'publish'
              contrib.createdAt = Date.now()
              contrib.updatedAt = Date.now()
              await mmContribution.update(
                {
                  status: 'publish'
                },
                {
                  where: {
                    id: fetchContribution.dataValues.id
                  }
                }
              )
            }
          }
        }
      }

      if (req.body.category === 'hypothesis') {
        for (let i = 0; i < req.allContribution.length; i++) {
          const fetchContribution = await mmContribution.findOne({
            where: {
              id: req.allContribution[i].dataValues.contribChildId
            }
          })

          if (
            fetchContribution.dataValues.category !== 'hypothesis' &&
            fetchContribution.dataValues.category !== 'question'
          ) {
            const contrib = fetchContribution.dataValues
            if (contrib.status !== 'draft') {
              contrib.status = 'deprecated'

              await mmContribution.update(
                {
                  status: 'deprecated'
                },
                {
                  where: {
                    id: fetchContribution.dataValues.id
                  }
                }
              )
            }
          }
          if (fetchContribution.dataValues.category === 'question') {
            const findDraft = await mmContributionDraft.findOne({
              where: {
                id: fetchContribution.dataValues.id
              }
            })
            if (findDraft) {
              findDraft.dataValues.status = 'publish'
              findDraft.dataValues.createdAt = Date.now()
              findDraft.dataValues.updatedAt = Date.now()
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
            fetchContribution.dataValues.category !== 'experiment' &&
            fetchContribution.dataValues.category !== 'hypothesis' &&
            fetchContribution.dataValues.category !== 'question'
          ) {
            const contrib = fetchContribution.dataValues
            if (contrib.status !== 'draft') {
              contrib.status = 'deprecated'

              await mmContribution.update(
                {
                  status: 'deprecated'
                },
                {
                  where: {
                    id: fetchContribution.dataValues.id
                  }
                }
              )
            }
          } else {
            const findDraft = await mmContributionDraft.findOne({
              where: {
                id: fetchContribution.dataValues.id
              }
            })
            if (findDraft) {
              findDraft.dataValues.status = 'publish'
              findDraft.dataValues.createdAt = Date.now()
              findDraft.dataValues.updatedAt = Date.now()
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

          if (fetchContribution.dataValues.category === 'analysis') {
            const contrib = fetchContribution.dataValues
            if (contrib.status !== 'draft') {
              contrib.status = 'deprecated'

              await mmContribution.update(
                {
                  status: 'deprecated'
                },
                {
                  where: {
                    id: fetchContribution.dataValues.id
                  }
                }
              )
            }
          } else {
            const findDraft = await mmContributionDraft.findOne({
              where: {
                id: fetchContribution.dataValues.id
              }
            })
            if (findDraft) {
              findDraft.dataValues.status = 'publish'
              findDraft.dataValues.createdAt = Date.now()
              findDraft.dataValues.updatedAt = Date.now()
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
          if (req.body.userId === fetchContribution.dataValues.userId) {
            const findDraft = await mmContributionDraft.findOne({
              where: {
                id: fetchContribution.dataValues.id
              }
            })
            if (findDraft) {
              findDraft.dataValues.status = 'publish'
              findDraft.dataValues.createdAt = Date.now()
              findDraft.dataValues.updatedAt = Date.now()
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

      for (let i = 0; i < req.relatedMediaUpdatePayload.length; i++) {
        const fetchRelatedMedia = await mmRelatedMedia.findOne({
          where: {
            id: req.relatedMediaUpdatePayload[i].id
          }
        })

        if (fetchRelatedMedia) {
          await mmRelatedMedia.update(req.relatedMediaUpdatePayload[i], {
            where: {
              id: req.relatedMediaUpdatePayload[i].id
            }
          })
        }
      }

      if (req.payload.status === 'publish') {
        req.payload.updatedAt = Date.now()
      }
      const findCurrentPayload = await mmContribution.findOne({
        where: {
          uuid: req.payload.uuid
        }
      })

      if (findCurrentPayload.dataValues.status === 'draft') {
        req.payload.createdAt = Date.now()
      }

      req.contribution.update(req.payload)

      const newMmRelationMedia = await mmRelatedMedia.bulkCreate(
        req.relatedMediapayloadData
      )

      req.relatedMedia = {
        relatedMedia: newMmRelationMedia.dataValues
      }
      await mmContributionDraft.destroy({
        where: {
          id: req.contribution.id
        }
      })
    } else if (req.body.status === 'draft') {
      if (req.contribution) {
        for (let i = 0; i < req.relatedMediaUpdatePayload.length; i++) {
          const fetchRelatedMedia = await mmRelatedMedia.findOne({
            where: {
              id: req.relatedMediaUpdatePayload[i].id
            }
          })

          if (fetchRelatedMedia) {
            await mmRelatedMedia.update(req.relatedMediaUpdatePayload[i], {
              where: {
                id: req.relatedMediaUpdatePayload[i].id
              }
            })
          }
        }
        req.contribution.update(req.payload)

        const newMmRelationMedia = await mmRelatedMedia.bulkCreate(
          req.relatedMediapayloadData
        )

        req.relatedMedia = {
          relatedMedia: newMmRelationMedia.dataValues
        }
      } else {
        req.payload.id = req.params.contributionId
        await mmContributionDraft.create(req.payload)
      }
    }

    await mmRelatedMedia.destroy({
      where: {
        id: req.relatedMediaDeletePayload
      }
    })

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
    res.status(200).json({ message: 'Contribution Updated.' })
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

module.exports = {
  validatePayload,
  update,
  response
}
