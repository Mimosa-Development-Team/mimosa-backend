const { mmContribution } = require('../../database/models')
const { errorResponse } = require('../../../helpers')
const { Op } = require('sequelize')

module.exports = async (req, res) => {
  try {
    const results = await mmContribution.findAll({
      where: {
        [Op.or]: [
          { subject: { [Op.like]: '%' + req.query.data + '%' } }
        ]
      },
      order: [
        ['updatedAt', 'DESC']
      ]
    })

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
