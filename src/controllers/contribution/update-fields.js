/* eslint-disable no-const-assign */
const {
  mmContribution,
  mmRelatedMedia,
  mmContributionDraft
} = require('../../database/models')
const {
  errorResponse,
  payloadValidator,
  cleanObject
} = require('../../../helpers')
const { Op } = require('sequelize')

const validatePayload = async (req, res, next) => {
  try {
    const contribution = await mmContribution.findByPk(req.params.contributionId)

    const payloadSchema = {
      type: 'object',
      properties: {
        id: {
          type: 'integer'
        },
        category: {
          type: 'string'
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
          maxLength: 60
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
          type: ['null', 'integer']
        },
        hypothesisStatus: {
          type: 'string'
        },
        mainParentId: {
          type: ['null', 'integer']
        }
      },
      required: [
        'userId',
        'subject',
        'details',
        'tags',
        'author',
        'status',
        'version'
      ]
    }

    const payloadData = {
      id: req.body.id,
      category: req.body.category,
      subject: req.body.subject,
      details: req.body.details,
      tags: req.body.tags,
      author: req.body.author,
      userId: req.body.userId,
      status: req.body.status,
      version: req.body.version,
      hypothesisStatus: req.body.hypothesisStatus,
      mainParentId: req.body.mainParentId,
      parentId: req.body.parentId
    }

    const payloadValid = payloadValidator(payloadSchema, payloadData)

    if (payloadValid !== true) {
      res.status(422).json({
        message: payloadValid
      })
    }
    let relatedmedia = []
    const oldRelatedMedia = []
    if (req.body.relatedmedia && req.body.relatedmedia.length === 1 && !req.body.relatedmedia[0].title) {
      relatedmedia = []
    } else {
      relatedmedia = []
      if (req.body.relatedmedia) {
        for (let i = 0; i < req.body.relatedmedia.length; i++) {
          if (!req.body.relatedmedia[i].id) {
            relatedmedia.push({
              contributionId: req.body.id,
              userId: req.body.userId,
              mediaDetails: {
                title: req.body.relatedmedia[i].title,
                link: req.body.relatedmedia[i].link
              }
            })
          } else {
            oldRelatedMedia.push({
              id: req.body.relatedmedia[i].id,
              mediaDetails: {
                title: req.body.relatedmedia[i].title,
                link: req.body.relatedmedia[i].link
              }
            })
          }
        }
      }
    }
    if (req.body.conferenceName) {
      if (req.body.conferenceId) {
        const findConference = await mmRelatedMedia.findOne({
          where: {
            id: req.body.conferenceId
          }
        })
        req.conference = findConference
      } else {
        relatedmedia.push({
          contributionId: req.body.id,
          userId: req.body.userId,
          conferenceName: req.body.conferenceName,
          conferenceDateDetails: {
            presentationDetails: req.body.presentationDetails,
            startTime: req.body.startTime,
            endTime: req.body.endTime
          }
        })
      }
    }
    req.contribution = contribution
    req.oldRelatedMedia = oldRelatedMedia
    req.relatedmedia = relatedmedia
    req.payload = cleanObject(payloadData)
    if (req.body.id) {
      req.payload.updatedAt = new Date()
    }
    return next()
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

const update = async (req, res, next) => {
  try {
    if (req.body.status === 'publish' && req.contribution.dataValues.id) {
      const results = await mmContribution.findOne({
        where: {
          id: req.body.id
        },
        include: [
          {
            model: mmContribution,
            as: 'children',
            include: [
              {
                model: mmContribution,
                as: 'children',
                include: [
                  {
                    model: mmContribution,
                    as: 'children',
                    include: [
                      {
                        model: mmContribution,
                        as: 'children'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      })
      if (results.children.length > 0) {
        for (let h = 0; h < results.children.length; h++) {
          await mmContribution.update({
            status: 'deprecated'
          }, {
            where: {
              id: results.children[h].id
            }
          })
          if (results.children[h].children.length > 0) {
            for (let e = 0; e < results.children[h].children.length; e++) {
              await mmContribution.update({
                status: 'deprecated'
              }, {
                where: {
                  id: results.children[h].children[e].id
                }
              })
              if (results.children[h].children[e].children.length > 0) {
                for (let d = 0; d < results.children[h].children[e].children.length; d++) {
                  await mmContribution.update({
                    status: 'deprecated'
                  }, {
                    where: {
                      id: results.children[h].children[e].children[d].id
                    }
                  })
                }
              }
            }
          }
        }
      }
    }
    let updateContribution = null
    if (req.contribution.status === 'publish' && req.body.status === 'draft') {
      const findDraft = await mmContributionDraft.findOne({
        where: {
          id: req.body.id
        }
      })
      if (findDraft) {
        updateContribution = await findDraft.update(req.payload)
      } else {
        updateContribution = await mmContributionDraft.create(req.payload)
      }
    }
    if (req.contribution.status === 'publish' && req.body.status === 'publish') {
      updateContribution = await req.contribution.update(req.payload)
      if (updateContribution) {
        const findDraft = await mmContributionDraft.findOne({
          where: {
            id: req.body.id
          }
        })
        if (findDraft) {
          findDraft.destroy()
        }
      }
    }
    console.log('req.token.id', req.token.id)
    if (req.body.category === 'analysis' && req.body.status === 'publish') {
      const publish = await mmContribution.update({
        status: 'publish'
      }, {
        where: {
          userId: req.token.id,
          mainParentId: updateContribution.mainParentId
        }
      })
      console.log('publish', publish)
      await mmContribution.update({
        status: 'publish'
      }, {
        where: {
          userId: req.token.id,
          id: updateContribution.mainParentId
        }
      })
    }

    if (req.body.category === 'data' && req.body.status === 'publish') {
      await mmContribution.update({
        status: 'publish'
      }, {
        where: {
          userId: req.token.id,
          mainParentId: updateContribution.mainParentId,
          category: { [Op.notIn]: ['analysis'] }
        }
      })
      await mmContribution.update({
        status: 'publish'
      }, {
        where: {
          userId: req.token.id,
          id: updateContribution.mainParentId
        }
      })
    }

    if (req.body.category === 'experiment' && req.body.status === 'publish') {
      await mmContribution.update({
        status: 'publish'
      }, {
        where: {
          userId: req.token.id,
          mainParentId: updateContribution.mainParentId,
          category: { [Op.notIn]: ['analysis', 'data'] }
        }
      })
      await mmContribution.update({
        status: 'publish'
      }, {
        where: {
          userId: req.token.id,
          id: updateContribution.mainParentId
        }
      })
    }

    if (req.body.category === 'hypothesis' && req.body.status === 'publish') {
      await mmContribution.update({
        status: 'publish'
      }, {
        where: {
          userId: req.token.id,
          mainParentId: updateContribution.mainParentId,
          category: { [Op.notIn]: ['analysis', 'data', 'experiment'] }
          // ]
        }
      })
      await mmContribution.update({
        status: 'publish'
      }, {
        where: {
          userId: req.token.id,
          id: updateContribution.mainParentId
        }
      })
    }

    if (req.contribution.status === 'draft' && (req.body.status === 'draft' || req.body.status === 'publish')) {
      updateContribution = await req.contribution.update(req.payload)
    }

    for (let om = 0; om < req.oldRelatedMedia.length; om++) {
      await mmRelatedMedia.update(req.oldRelatedMedia[om], {
        where: {
          id: req.oldRelatedMedia[om].id
        }
      })
    }
    for (let nm = 0; nm < req.relatedmedia.length; nm++) {
      await mmRelatedMedia.create(req.relatedmedia[nm])
    }
    if (req.conference) {
      await req.conference.update({
        conferenceName: req.body.conferenceName,
        conferenceDateDetails: {
          presentationDetails: req.body.presentationDetails,
          startTime: req.body.startTime,
          endTime: req.body.endTime
        }
      })
    }
    // console.log(req.payload)

    const conference = {
      id: null,
      conferenceName: '',
      presentationDetails: '',
      startTime: '',
      endTime: ''
    }
    const getAllRmedia = await mmRelatedMedia.findAll({
      where: {
        contributionId: req.body.id
      }
    })
    const rMedia = []

    for (let i = 0; i < getAllRmedia.length; i++) {
      if (getAllRmedia[i].conferenceDateDetails) {
        conference.id = getAllRmedia[i].id
        conference.conferenceName = getAllRmedia[i].conferenceName
        conference.presentationDetails = getAllRmedia[i].conferenceDateDetails.presentationDetails
        conference.startTime = getAllRmedia[i].conferenceDateDetails.startTime
        conference.endTime = getAllRmedia[i].conferenceDateDetails.endTime
      } else {
        const temp = {
          id: getAllRmedia[i].id,
          link: getAllRmedia[i].mediaDetails.link,
          title: getAllRmedia[i].mediaDetails.title
        }
        rMedia.push(temp)
      }
    }
    req.rMedia = rMedia
    req.conferenceMedia = conference
    req.updateContribution = updateContribution

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
    res.status(200).json({ message: 'Contribution Updated.', data: req.updateContribution, conference: req.conferenceMedia, relatedmedia: req.rMedia })
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
