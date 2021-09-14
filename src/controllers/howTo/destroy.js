const { mmHowto } = require('../../database/models')
const { errorResponse } = require('../../../helpers')

const validate = async (req, res, next) => {
  try {
    const faq = await mmHowto.findByPk(req.params.howToId)

    if (faq === undefined) {
      return res.status(404).json({
        message: 'FAQ Not Found'
      })
    }

    req.faq = faq

    return next()
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

const destroy = async (req, res, next) => {
  try {
    req.faq.destroy()

    return next()
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

const response = async (req, res) => {
  try {
    res.status(200).json({ message: 'FAQ Deleted.' })
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
