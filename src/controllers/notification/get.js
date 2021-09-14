const { mmNotification, mmUser } = require('../../database/models')
const { errorResponse } = require('../../../helpers')

module.exports = async (req, res) => {
  try {
    const results = await mmNotification.findAll({
      where: {
        poster: req.token.id
      },
      include: [{
        model: mmUser
      }]
    })
    res.status(200).json(results)
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}
