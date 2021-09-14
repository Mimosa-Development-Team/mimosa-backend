const { mmRelatedMedia } = require('../../database/models')
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
        conferenceName: {
          type: 'string'
        },
        conferenceDateDetails: {
          type: 'object'
        },
        mediaDetails: {
          type: 'object'
        },
        contributionId: {
          type: 'integer'
        },
        userId: {
          type: 'string'
        }
      },
      required: ['contributionId', 'userId']
    }

    const payloadData = {
      conferenceName: req.body.conferenceName,
      conferenceDateDetails: req.body.conferenceDateDetails,
      mediaDetails: req.body.mediaDetails,
      contributionId: req.body.contributionId,
      userId: req.body.userId
    }

    const payloadValid = payloadValidator(payloadSchema, payloadData)

    if (payloadValid !== true) {
      res.status(422).json({
        message: payloadValid
      })
    }

    req.payload = payloadData

    return next()
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

const create = async (req, res, next) => {
  try {
    const newRelatedMedia = await mmRelatedMedia.create(req.payload)

    req.data = {
      data: newRelatedMedia.dataValues
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
    res.status(201).json(req.data)
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
