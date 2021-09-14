const express = require('express')
const router = express.Router()
const auth = require('../../../lib/policy')
const draftController = require('../../controllers').draft

// Routes

router.delete(
    '/:contributionId',
    auth,
    draftController.destroy.validate,
    draftController.destroy.destroy,
    draftController.destroy.response
  )
  
  module.exports = router
  