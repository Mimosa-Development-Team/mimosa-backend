const { mmUser } = require('../../database/models')
const {
  errorResponse,
  payloadValidator,
  cleanObject
} = require('../../../helpers')
const jwtDecode = require('jwt-decode')
const authService = require('../../services/auth.service')

const validateJwt = async (req, res, next) => {
  try {
    const decoded = await jwtDecode(req.body.token)

    if (!('sub' in decoded)) {
      return res.status(404).json({
        message: 'Invalid User!'
      })
    }
    req.payload = cleanObject(decoded)
    return next()
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

const validateUser = async (req, res, next) => {
  try {
    const user = await mmUser.findOne({ where: { orcidId: req.payload.sub } })

    if (user) {
      req.user = user.dataValues
      if (req.body.email) {
        user.update({ email: req.body.email })
      }
      return next()
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
          maxLength: 20
        }
      }
    }
    const payloadData = {
      firstName: req.payload.given_name,
      lastName: req.payload.family_name,
      orcidId: req.payload.sub,
      email: req.body.email,
      userColor: '#' + Math.floor(Math.random() * 16777215).toString(16)
    }

    const payloadValid = payloadValidator(payloadSchema, payloadData)

    if (payloadValid !== true) {
      res.status(422).json({
        message: payloadValid
      })
    }

    const newUser = await mmUser.create(payloadData)
    if (newUser) {
      req.user = newUser.dataValues
      return next()
    } else {
      return res.status(422).json({
        message: 'Registration Failed!'
      })
    }
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

const auth = async (req, res, next) => {
  try {
    const token = authService.issue({ id: req.user.id })
    req.user = {
      token,
      user: req.user
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
  next()
}

const response = async (req, res) => {
  try {
    res.status(200).json(req.user)
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

module.exports = {
  validateJwt,
  validateUser,
  auth,
  response
}
