const { mmContribution } = require('../../database/models')
const { errorResponse } = require('../../../helpers')

module.exports = async (req, res) => {
  try {
    const page = req.query.page
    const limit = req.query.limit
    let results = []
    let userContrib = []
    if (req.params.userId) {
      [results] = await mmContribution.getUserQuestion(
        req.params.userId,
        req.params.orderBy
      )
    }
    if (req.params.userId) {
      [userContrib] = await mmContribution.getUserContributionCtr(
        req.params.userId
      )
    }

    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const restt = results.slice(startIndex, endIndex)
    const nextPageNum =
      restt.length === Number(limit) ? Number(page) + 1 : undefined

    if (results === undefined) {
      return res.status(404).json({
        message: "User's Question Not Found"
      })
    }

    res.status(200).json({
      questionCtr: userContrib.length > 0 ? userContrib[0].questionCtr : 0,
      hypothesisCtr: userContrib.length > 0 ? userContrib[0].hypothesisCtr : 0,
      experimentCtr: userContrib.length > 0 ? userContrib[0].experimentCtr : 0,
      dataCtr: userContrib.length > 0 ? userContrib[0].dataCtr : 0,
      analysisCtr: userContrib.length > 0 ? userContrib[0].analysisCtr : 0,
      totalContributions:
        userContrib.length > 0 ? userContrib[0].totalContributions : 0,
      contributions: restt,
      nextPage: nextPageNum
    })
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}
