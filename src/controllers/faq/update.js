const { mmFaq } = require('../../database/models')
const { errorResponse, payloadValidator, cleanObject } = require('../../../helpers')

const validatePayload = async (req, res, next) => {
  try {
    const faq = await mmFaq.findByPk(req.params.faqId)

    if (faq === undefined) {
      return res.status(404).json({
        message: 'FAQ Not Found'
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
      }
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

    req.faq = faq
    req.payload = cleanObject(payloadData)

    return next()
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

const update = async (req, res, next) => {
  try {
    req.faq.update(req.payload)

    return next()
  } catch (error) {
    // TODO: Create a better error handling for sequelize validation errors
    if (error.name === 'SequelizeUniqueConstraintError' && error.message === 'Validation error') {
      return res.status(409).json({ message: error.errors[0].message })
    }

    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

const response = async (req, res) => {
  try {
    res.status(200).json({ message: 'FAQ Updated.' })
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
