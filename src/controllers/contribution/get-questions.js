const {
  mmContribution,
  mmContributionDraft
} = require('../../database/models')
const { errorResponse } = require('../../../helpers')

module.exports = async (req, res) => {
  try {
    const page = req.query.page
    const limit = req.query.limit
    const [results] = await mmContribution.getQuestions(req.query.orderBy)
    let draftQ = []
    if (req.query.userId !== 'null' && parseInt(page) === 1) {
      [draftQ] = await mmContributionDraft.getQuestions(
        req.query.userId,
        req.query.orderBy
      )
    }

    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const restt = results.slice(startIndex, endIndex)
    const nextPageNum =
      restt.length === Number(limit) ? Number(page) + 1 : undefined

    if (results === undefined || results.length === 0) {
      return res.status(404).json({
        message: 'Question Not Found'
      })
    }

    res
      .status(200)
      .json({ draftQuestions: draftQ, data: restt, nextPage: nextPageNum })
  } catch (error) {
    const response = errorResponse(error)
    res.status(500).json(response)
  }
}