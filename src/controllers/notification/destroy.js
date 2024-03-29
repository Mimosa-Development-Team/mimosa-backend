const { mmNotification } = require('../../database/models')
const { errorResponse } = require('../../../helpers')

const validate = async (req, res, next) => {
  try {
    const notification = await mmNotification.findByPk(req.params.notificationId)

    if (notification === undefined) {
      return res.status(404).json({
        message: 'Notification Not Found'
      })
    }

    req.notification = notification

    return next()
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

const destroy = async (req, res, next) => {
  try {
    req.notification.destroy()

    return next()
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

const response = async (req, res) => {
  try {
    res.status(200).json({ message: 'Notification Deleted.' })
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
