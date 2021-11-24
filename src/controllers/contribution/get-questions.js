const {
  mmContribution,
  mmContributionDraft,
  mmComment,
  mmRelatedMedia,
  mmUser
} = require('../../database/models')
const { errorResponse } = require('../../../helpers')

module.exports = async (req, res) => {
  try {
    const page = req.query.page
    const limit = 5
    let results = []
    const count = await mmContribution.count({
      where: {
        category: 'question',
        status: 'publish'
      }
    })
    if (count >= page * limit) {
      results = await mmContribution.findAll({
        where: {
          category: 'question',
          status: 'publish'
        },
        order: [
          ['updatedAt', req.query.orderBy]
        ],
        include: [
          {
            model: mmComment,
            as: 'commentCount'
          },
          {
            model: mmRelatedMedia,
            as: 'relatedMediaCount'
          },
          {
            model: mmContribution,
            as: 'total'
          },
          {
            model: mmUser,
            as: 'poster'
          }
        ],
        limit: limit,
        offset: (page - 1) * limit
      })
    } else {
      results = []
    }

    let draftQ = []
    if (req.query.userId !== 'null' && parseInt(page) === 1) {
      draftQ = await mmContributionDraft.findAll({
        where: {
          category: 'question',
          userId: req.token.id
        },
        order: [
          ['updatedAt', req.query.orderBy]
        ],
        include: [
          {
            model: mmContributionDraft,
            as: 'total'
          },
          {
            model: mmUser,
            as: 'poster'
          }
        ]
      })
    }
    const nextPageNum =
    results.length === Number(limit) ? Number(page) + 1 : undefined

    if (results === undefined || (results.length === 0 && page === 1)) {
      return res.status(404).json({
        message: 'Question Not Found'
      })
    }

    res
      .status(200)
      .json({ draftQuestions: draftQ, data: results, nextPage: nextPageNum })
  } catch (error) {
    const response = errorResponse(error)
    res.status(500).json(response)
  }
}
