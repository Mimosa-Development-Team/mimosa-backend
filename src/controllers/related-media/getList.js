const { mmRelatedMedia } = require('../../database/models')
const { errorResponse } = require('../../../helpers')

module.exports = async (req, res) => {
  try {
    const [results] = await mmRelatedMedia.getList(req.params.contributionId)

    if (results === undefined || results.length === 0) {
      return res.status(404).json({
        message: 'Related Media Not Found'
      })
    }

    res.status(200).json(results)
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}
