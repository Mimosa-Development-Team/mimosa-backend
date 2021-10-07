const {
  mmContributionDraft,
  mmContribution
} = require('../../database/models')
const { errorResponse } = require('../../../helpers')

const validate = async (req, res, next) => {
  try {
    const contributionDraft = await mmContributionDraft.findOne({
      where: {
        id: req.params.contributionId
      }
    })

    const contribution = await mmContribution.findOne({
      where: {
        id: req.params.contributionId
      }
    })

    req.findContributionDraft = contributionDraft
    req.findContribution = contribution

    return next()
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

const destroy = async (req, res, next) => {
  try {
    // check if corresponding contribution is draft or update
    if (req.findContribution && req.findContribution.status === 'draft') {
      await req.findContribution.destroy()
    }

    await req.findContributionDraft.destroy()

    return next()
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

const response = async (req, res) => {
  try {
    res.status(200).json({ message: 'Draft Deleted.', data: req.findContributionDraft })
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
