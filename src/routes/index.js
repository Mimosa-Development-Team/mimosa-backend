const express = require('express')
const router = express.Router()
const user = require('./user')
const faq = require('./faq')
const contribution = require('./contribution')
const draft = require('./draft')
const comment = require('./comment')
const relatedMedia = require('./related-media')
const notification = require('./notification')

router.use('/users', user)
router.use('/faq', faq)
router.use('/contribution', contribution)
router.use('/draft', draft)
router.use('/comment', comment)
router.use('/related-media', relatedMedia)
router.use('/notification', notification)

module.exports = router
