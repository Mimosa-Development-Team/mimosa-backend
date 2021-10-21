const {
  mmContribution,
  mmUser,
  mmContributionDraft,
  mmRelatedMedia
} = require('../../database/models')
const { errorResponse } = require('../../../helpers')
const { Op } = require('sequelize')

module.exports = async (req, res) => {
  try {
    let results = null
    if (req.token && req.token.id) {
      results = await mmContribution.findOne({
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
            required: false,
            where: {
              [Op.or]: [
                {
                  status: 'publish'
                },
                {
                  status: 'deprecated'
                },
                {
                  status: 'draft',
                  userId: req.token.id
                }
              ]
            },
            include: [
              {
                model: mmUser,
                as: 'poster'
              },
              {
                model: mmContribution,
                as: 'children',
                required: false,
                where: {
                  [Op.or]: [
                    {
                      status: 'publish'
                    },
                    {
                      status: 'deprecated'
                    },
                    {
                      status: 'draft',
                      userId: req.token.id
                    }
                  ]
                },
                include: [
                  {
                    model: mmUser,
                    as: 'poster'
                  },
                  {
                    model: mmContribution,
                    as: 'children',
                    required: false,
                    where: {
                      [Op.or]: [
                        {
                          status: 'publish'
                        },
                        {
                          status: 'deprecated'
                        },
                        {
                          status: 'draft',
                          userId: req.token.id
                        }
                      ]
                    },
                    include: [
                      {
                        model: mmUser,
                        as: 'poster'
                      },
                      {
                        model: mmContribution,
                        as: 'children',
                        required: false,
                        where: {
                          [Op.or]: [
                            {
                              status: 'publish'
                            },
                            {
                              status: 'deprecated'
                            },
                            {
                              status: 'draft',
                              userId: req.token.id
                            }
                          ]
                        },
                        include: [
                          {
                            model: mmUser,
                            as: 'poster'
                          },
                          {
                            model: mmContributionDraft,
                            as: 'draft'
                          }
                        ]
                      },
                      {
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
    } else {
      results = await mmContribution.findOne({
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
            required: false,
            where: {
              status: 'publish'
            },
            include: [
              {
                model: mmUser,
                as: 'poster'
              },
              {
                model: mmContribution,
                as: 'children',
                required: false,
                where: {
                  status: 'publish'
                },
                include: [
                  {
                    model: mmUser,
                    as: 'poster'
                  },
                  {
                    model: mmContribution,
                    as: 'children',
                    required: false,
                    where: {
                      status: 'publish'
                    },
                    include: [
                      {
                        model: mmUser,
                        as: 'poster'
                      },
                      {
                        model: mmContribution,
                        as: 'children',
                        required: false,
                        where: {
                          status: 'publish'
                        },
                        include: [
                          {
                            model: mmUser,
                            as: 'poster'
                          },
                          {
                            model: mmContributionDraft,
                            as: 'draft'
                          }
                        ]
                      },
                      {
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
    }
    res
      .status(200)
      .json(results)
  } catch (error) {
    const response = errorResponse(error)
    res.status(500).json(response)
  }
}
