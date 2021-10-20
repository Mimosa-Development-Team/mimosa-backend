const {
  mmContribution,
  mmRelatedMedia,
  mmContributionDraft,
  mmUser
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
        method: {
          type: 'string'
        },
        mainParentId: {
          type: ['null', 'integer']
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
      hypothesisStatus: req.body.hypothesisStatus,
      mainParentId: req.body.mainParentId,
      parentId: req.body.parentId
    }
    const findAuthor = await mmUser.findOne({
      where: {
        id: req.body.userId
      }
    })

    const payloadValid = payloadValidator(payloadSchema, payloadData)

    if (payloadValid !== true) {
      res.status(422).json({
        message: payloadValid
      })
    }
    payloadData.searchString = payloadData.subject.concat(' ', payloadData.tags.toString(), ' ', findAuthor.firstName, ' ', findAuthor.lastName)
    req.payload = payloadData
    return next()
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

const create = async (req, res, next) => {
  try {
    const saveContribution = await mmContribution.create(req.payload)
    if (req.payload.status === 'draft') {
      req.payload.id = saveContribution.id
      await mmContributionDraft.create(req.payload)
    }
    let relatedmedia = []
    if (req.body.category === 'question') {
      if (req.body.relatedmedia.length === 1 && !req.body.relatedmedia[0].title) {
        relatedmedia = []
      } else {
        relatedmedia = []
        for (let i = 0; i < req.body.relatedmedia.length; i++) {
          if (req.body.relatedmedia[i].title) {
            relatedmedia.push({
              contributionId: saveContribution.id,
              userId: req.body.userId,
              mediaDetails: {
                title: req.body.relatedmedia[i].title,
                link: req.body.relatedmedia[i].link
              }
            })
          }
        }
      }
      if (req.body.conferenceName) {
        relatedmedia.push({
          contributionId: saveContribution.id,
          userId: req.body.userId,
          conferenceName: req.body.conferenceName,
          conferenceDateDetails: {
            presentationDetails: req.body.presentationDetails,
            startTime: req.body.startTime,
            endTime: req.body.endTime
          }
        })
      }
      await mmRelatedMedia.bulkCreate(relatedmedia, { returning: true })
      const conference = {
        id: null,
        conferenceName: '',
        presentationDetails: '',
        startTime: '',
        endTime: ''
      }
      const getAllRmedia = await mmRelatedMedia.findAll({
        where: {
          contributionId: saveContribution.id
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
      req.conference = conference
      req.saveRm = rMedia
    }
    req.saveContribution = saveContribution
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
    res.status(201).json({ data: req.saveContribution, relatedmedia: req.saveRm || [], conference: req.conference })
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
