const { mmRelatedMedia } = require('../../database/models')
const { errorResponse } = require('../../../helpers')

const validate = async (req, res, next) => {
  try {
    const relatedMedia = await mmRelatedMedia.findByPk(req.params.relatedMediaId)

    if (relatedMedia === undefined) {
      return res.status(404).json({
        message: 'Comment Not Found'
      })
    }

    req.relatedMedia = relatedMedia

    return next()
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

const destroy = async (req, res, next) => {
  try {
    req.relatedMedia.destroy()

    return next()
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

const response = async (req, res) => {
  try {
    res.status(200).json({ message: 'Related Media Deleted.' })
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
