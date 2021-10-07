const {
  mmContributionRelation,
  mmContribution,
  mmContributionDraft
} = require('../../database/models')
const { errorResponse } = require('../../../helpers')

const validate = async (req, res, next) => {
  try {
    const contribution = await mmContribution.findOne({
      where: {
        id: req.params.contributionId
      }
    })

    const contributionDraft = await mmContributionDraft.findOne({
      where: {
        id: req.params.contributionId
      }
    })

    req.findContributionDraft = contributionDraft

    // this one might not be useful now
    req.contribution = contribution.dataValues
    req.findContribution = contribution

    return next()
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

// function to destroy a contribution,
// its related drafts and its relations
async function destroyAllRelated (contribution) {
  await mmContributionRelation.destroy({
    where: {
      contribChildId:
          contribution.id
    }
  })
  await mmContributionDraft.destroy({
    where: {
      id: contribution.id
    }
  })
  await contribution.destroy()
}

const destroy = async (req, res, next) => {
  // only destroying leaves is allowed.

  try {
    // destroy contribution
    destroyAllRelated(req.findContribution)
    // destroy draft only

    return next()
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

const response = async (req, res) => {
  try {
    res.status(200).json({ message: 'Related Media Deleted.', data: req.contribution })
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

module.exports = {
  validate,
  destroy,
  response
}
