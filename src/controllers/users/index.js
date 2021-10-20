const getAll = require('./getAll')
const get = require('./get')
const getOrcidId = require('./get-orcid-id')
const update = require('./update')
const create = require('./create')
const destroy = require('./destroy')
const auth = require('./auth')
const getUser = require('./get-users')
const updateEmail = require('./update-email')
const updateNotification = require('./update-notification')

module.exports = {
  getAll,
  get,
  getUser,
  auth,
  update,
  create,
  destroy,
  updateEmail,
  updateNotification,
  getOrcidId
}
