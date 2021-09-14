const { mmComment } = require('../../database/models')
const { errorResponse } = require('../../../helpers')

module.exports = async (req, res) => {
  try {
    const [results] = await mmComment.countComments(req.params.contributionId)

    if (results === undefined || results.length === 0) {
      return res.status(404).json({
        message: 'No Comments Found'
      })
    }

    res.status(200).json(results)
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}
