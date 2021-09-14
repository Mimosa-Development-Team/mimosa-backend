const { mmUser } = require('../../database/models')
const { errorResponse } = require('../../../helpers')

const validate = async (req, res, next) => {
  try {
    const user = await mmUser.findByPk(req.params.userId)

    if (user === undefined) {
      return res.status(404).json({
        message: 'User Not Found'
      })
    }

    req.user = user

    return next()
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

const destroy = async (req, res, next) => {
  try {
    req.user.destroy()

    return next()
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

const response = async (req, res) => {
  try {
    res.status(200).json({ message: 'User Deleted.' })
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

module.exports = {
  validate,
  destroy,
  response
}
