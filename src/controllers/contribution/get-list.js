const {
  mmContribution,
  mmUser,
  mmContributionDraft,
  mmRelatedMedia
} = require('../../database/models')
const { errorResponse } = require('../../../helpers')

module.exports = async (req, res) => {
  try {
    const results = await mmContribution.findOne({
      where: {
        id: req.params.contributionId
      },
      include: [
        {
          model: mmContribution,
          as: 'total'
        },
        {
          model: mmRelatedMedia,
          as: 'relatedmedia'
        },
        {
          model: mmUser,
          as: 'poster'
        },
        {
          model: mmContribution,
          as: 'children',
          include: [
            {
              model: mmUser,
              as: 'poster'
            },
            {
              model: mmContribution,
              as: 'children',
              include: [
                {
                  model: mmUser,
                  as: 'poster'
                },
                {
                  model: mmContribution,
                  as: 'children',
                  include: [
                    {
                      model: mmUser,
                      as: 'poster'
                    },
                    {
                      model: mmContribution,
                      as: 'children'
                    }, {
                      model: mmContributionDraft,
                      as: 'draft'
                    }
                  ]
                }, {
                  model: mmContributionDraft,
                  as: 'draft'
                }
              ]
            }, {
              model: mmContributionDraft,
              as: 'draft'
            }
          ]
        }, {
          model: mmContributionDraft,
          as: 'draft'
        }
      ]
    })
    // const totalChild = await mmContribution.count({
    //   where: {
    //     mainParentId: 1
    //   }
    // })
    // results.total = await totalChild
    res
      .status(200)
      .json(results)
  } catch (error) {
    const response = errorResponse(error)
    res.status(500).json(response)
  }
}
