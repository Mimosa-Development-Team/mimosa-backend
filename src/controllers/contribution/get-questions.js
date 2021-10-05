const {
  mmContribution,
  mmUser
} = require('../../database/models')
const { errorResponse } = require('../../../helpers')

module.exports = async (req, res) => {
  try {
    // const page = req.query.page
    // const limit = req.query.limit
    // const [results] = await mmContribution.getQuestions(req.query.orderBy)
    const options = {
      page: 1, // Default 1
      paginate: 25, // Default 25
      order: [['updatedAt', req.query.orderBy]],
      where: {
        category: 'question'
      },
      include: [{
        model: mmUser,
        as: 'poster',
        attributes: ['id', 'firstName', 'lastName', 'userColor']
      },
      {
        model: mmContribution,
        as: 'total'
      }]
    }
    const { docs, pages, total } = await mmContribution.paginate(options)
    const draftQ = []
    // if (req.query.userId !== 'null' && parseInt(page) === 1) {
    //   [draftQ] = await mmContributionDraft.getQuestions(
    //     req.query.userId,
    //     req.query.orderBy
    //   )
    // }

    // const startIndex = (page - 1) * limit
    // const endIndex = page * limit
    // const restt = results.slice(startIndex, endIndex)
    // const nextPageNum =
    //   restt.length === Number(limit) ? Number(page) + 1 : undefined

    // if (results === undefined || results.length === 0) {
    //   return res.status(404).json({
    //     message: 'Question Not Found'
    //   })
    // }

    res
      .status(200)
      .json({ draftQuestions: draftQ, data: docs, nextPage: pages, total })
  } catch (error) {
    const response = errorResponse(error)
    res.status(500).json(response)
  }
}
