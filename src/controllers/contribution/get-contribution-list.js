const { mmContribution } = require('../../database/models')
const { errorResponse } = require('../../../helpers')

module.exports = async (req, res) => {
  try {
    let results = []
    if (req.params.userId) {
      [results] = await mmContribution.getContributionList(
        req.params.contributionId,
        req.params.userId
      )
    } else {
      [results] = await mmContribution.getContributionList(
        req.params.contributionId,
        req.params.userId
      )
    }

    if (results === undefined || results.length === 0) {
      return res.status(404).json({
        message: 'Question Not Found'
      })
    }

    res.status(200).json(results)
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}
