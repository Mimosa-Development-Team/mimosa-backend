const get = require('./get')
const getSingle = require('./get-single')
const getContributionList = require('./get-contribution-list')
const getContributionSearch = require('./get-contribution-search')
const create = require('./create')
const update = require('./update')
const updateAll = require('./update-fields')
const getContributionTags = require('./get-tags')
const destroy = require('./destroy')
const getQuestions = require('./get-questions')
const getList = require('./get-list')

module.exports = {
  get,
  getContributionList,
  create,
  destroy,
  update,
  getList,
  updateAll,
  getContributionTags,
  getQuestions,
  getContributionSearch,
  getSingle
}
