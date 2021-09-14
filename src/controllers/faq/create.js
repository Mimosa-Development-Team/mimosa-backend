const { mmFaq } = require('../../database/models')
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
        topic: {
          type: 'string'
        },
        question: {
          type: 'string'
        },
        shortDetails: {
          type: 'string'
        },
        fullDetails: {
          type: 'string'
        }
      },
      required: ['topic', 'question', 'fullDetails']
    }

    const payloadData = {
      topic: req.body.topic,
      question: req.body.question,
      shortDetails: req.body.shortDetails,
      fullDetails: req.body.fullDetails
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
    const newFaq = await mmFaq.create(req.payload)

    req.data = {
      data: newFaq.dataValues
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
