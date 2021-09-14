const { mmUser } = require('../../database/models')
const { errorResponse } = require('../../../helpers')

module.exports = async (req, res) => {
  try {
    const users = await mmUser.findAll()

    res.status(200).json(users)
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}
