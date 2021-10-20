const { mmFaq } = require('../../database/models')
const { errorResponse } = require('../../../helpers')
const { Op } = require('sequelize')

module.exports = async (req, res) => {
  try {
    const results = await mmFaq.findAll({
      where: {
        [Op.or]: [
          { topic: { [Op.iLike]: '%' + req.params.question + '%' } },
          { question: { [Op.iLike]: '%' + req.params.question + '%' } }
        ]
      },
      order: [
        ['updatedAt', 'DESC']
      ]
    })

    if (results === undefined || results.length === 0) {
      return res.status(404).json({
        message: 'FAQ Not Found'
      })
    }

    res.status(200).json(results)
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}
