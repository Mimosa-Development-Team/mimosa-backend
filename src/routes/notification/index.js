const express = require('express')
const router = express.Router()
const auth = require('../../../lib/policy')

const notificationController = require('../../controllers').notification

router.get('/', auth, notificationController.get)

router.delete('/', auth, notificationController.destroyAll.validate,
  notificationController.destroyAll.destroy,
  notificationController.destroyAll.response
)

router.delete('/:notificationId', notificationController.destroy.validate,
  notificationController.destroy.destroy,
  notificationController.destroy.response
)

module.exports = router
