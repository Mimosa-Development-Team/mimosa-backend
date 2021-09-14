const { mmUser } = require('../../database/models')
const { errorResponse } = require('../../../helpers')

module.exports = async (req, res) => {
  try {
    const user = await mmUser.findByPk(req.params.userId)

    if (user === undefined) {
      return res.status(404).json({
        message: 'User Not Found'
      })
    }

    const resultUser = {
      ...user.dataValues
    }

    delete resultUser.password

    res.status(200).json(resultUser)
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}
