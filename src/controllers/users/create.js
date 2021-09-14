const { mmUser } = require('../../database/models')
const { errorResponse, payloadValidator } = require('../../../helpers')
const { hash } = require('../../services/bcrypt.service')
const authService = require('../../services/auth.service')

const validatePayload = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(422).json({
        message: 'Nothing to create.'
      })
    }

    const payloadSchema = {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          maxLength: 26
        },
        lastName: {
          type: 'string',
          maxLength: 26
        },
        orcidId: {
          type: ['string', 'null'],
          maxLength: 26
        }
      },
      required: ['firstName', 'lastName', 'password']
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

    payloadData.password = hash(payloadData.password)

    req.payload = payloadData

    return next()
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

const create = async (req, res, next) => {
  try {
    const newUser = await mmUser.create(req.payload)
    const token = authService.issue({ id: newUser.id })

    req.user = {
      token,
      user: newUser.dataValues
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
    res.status(201).json(req.user)
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

module.exports = {
  validatePayload,
  create,
  response
}
