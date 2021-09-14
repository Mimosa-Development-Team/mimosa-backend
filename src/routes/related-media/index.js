const express = require('express')
const router = express.Router()
const auth = require('../../../lib/policy')
const relatedMediaController = require('../../controllers').relatedMedia

// Routes
/**
 * @swagger
 * /api/v1/related-media/{contributionId}:
 *   get:
 *     summary: Get Related Media of a Contribution
 *     parameters:
 *        - in: path
 *          name: contributionId
 *          schema:
 *             type: integer
 *          required: true
 *          description: ID of the Contribution
 *     tags:
 *        - RELATED MEDIA ENDPOINTS
 *     description: Fetch related medias of a Contribution
 *     responses:
 *       200:
 *         description: List of related medias of a Contribution
 */
router.get('/:contributionId', auth, relatedMediaController.get)

router.get('/list/:contributionId', auth, relatedMediaController.getList)

router.get('/count/:contributionId', auth, relatedMediaController.getCount)

/**
 * @swagger
 * paths:
 *  /api/v1/related-media:
 *    post:
 *      summary: Create Related Media of Contribution
 *      tags:
 *          - RELATED MEDIA ENDPOINTS
 *      requestBody:
 *        content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  required:
 *                      - conferenceName
 *                      - conferenceDateDetails
 *                      - mediaDetails
 *                      - file
 *                      - userId
 *                      - contributionId
 *                  properties:
 *                      conferenceName:
 *                          type: text
 *                          example: Lorem ipsum
 *                      conferenceDateDetails:
 *                          type: object
 *                          example: {"presentationDetails": "2021-01-29", "startTime": "07:00", "endTime": "16:00"}
 *                      mediaDetails:
 *                          type: object
 *                          example: {"title": "Sample Media Title", "link": "https://testlink.com"}
 *                      file:
 *                          type: object
 *                          example: {}
 *                      userId:
 *                          type: string
 *                          example: 48e40a9c-c5e9-4d63-9aba-b77cdf4ca67b
 *                      contributionId:
 *                          type: integer
 *                          example: 1
 *      responses:
 *        200:
 *          description: Related Media Added
 *
 */
router.post(
  '/',
  auth,
  relatedMediaController.create.validate,
  relatedMediaController.create.create,
  relatedMediaController.create.response
)

/**
 * @swagger
 * paths:
 *  /api/v1/related-media/{relatedMediaId}:
 *    delete:
 *      summary: Delete Related Media.
 *      parameters:
 *        - in: path
 *          name: relatedMediaId
 *          schema:
 *             type: integer
 *          required: true
 *          description: ID of the Related Media
 *      tags:
 *          - RELATED MEDIA ENDPOINTS
 *      responses:
 *        200:
 *          description: Updated
 *
 */
router.delete(
  '/:relatedMediaId',
  auth,
  relatedMediaController.destroy.validate,
  relatedMediaController.destroy.destroy,
  relatedMediaController.destroy.response
)

module.exports = router
