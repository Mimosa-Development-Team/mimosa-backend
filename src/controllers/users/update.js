const { mmUser } = require('../../database/models')
const { errorResponse, payloadValidator, cleanObject } = require('../../../helpers')

const validatePayload = async (req, res, next) => {
  try {
    const user = await mmUser.findByPk(req.params.userId)

    if (user === undefined) {
      return res.status(404).json({
        message: 'User Not Found'
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
        firstName: {
          type: ['string', 'null'],
          maxLength: 26
        },
        lastName: {
          type: ['string', 'null'],
          maxLength: 26
        },
        orcidId: {
          type: ['string', 'null'],
          maxLength: 26
        }
      }
    }

    const payloadData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName ? req.body.lastName : '',
      orcidId: req.body.orcidId
    }

    const payloadValid = payloadValidator(payloadSchema, payloadData)

    if (payloadValid !== true) {
      res.status(422).json({
        message: payloadValid
      })
    }

    req.user = user
    req.payload = cleanObject(payloadData)

    return next()
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

const update = async (req, res, next) => {
  try {
    req.user.update(req.payload)

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
    res.status(200).json({ message: 'User Updated.' })
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
