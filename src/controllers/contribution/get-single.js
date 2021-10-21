const { mmContribution } = require('../../database/models')
const { errorResponse } = require('../../../helpers')

module.exports = async (req, res) => {
  try {
    const results = await mmContribution.findOne({
      where: {
        id: req.params.contributionId
      }
    })

    if (results === undefined) {
      return res.status(404).json({
        message: "User's Question Not Found"
      })
    }

    res.status(200).json({ data: results })
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}
