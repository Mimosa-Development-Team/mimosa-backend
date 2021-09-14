const express = require('express')
const router = express.Router()
const auth = require('../../../lib/policy')
const commentController = require('../../controllers').comment

/**
 * Define middleware as follows
 */
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })

// Routes
/**
 * @swagger
 * /api/v1/comment/{contributionId}:
 *   get:
 *     summary: Get Comments of a Contribution
 *     parameters:
 *        - in: path
 *          name: contributionId
 *          schema:
 *             type: integer
 *          required: true
 *          description: ID of the Contribution
 *     tags:
 *        - COMMENT ENDPOINTS
 *     description: Fetch comments of a Contribution
 *     responses:
 *       200:
 *         description: List of comments of a Contribution
 */
router.get('/:contributionId', auth, commentController.get)

router.get('/count/:contributionId', auth, commentController.getCount)

/**
 * @swagger
 * paths:
 *  /api/v1/comment:
 *    post:
 *      summary: Create Comment of Contribution
 *      tags:
 *          - COMMENT ENDPOINTS
 *      requestBody:
 *        content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  required:
 *                      - comment
 *                      - userId
 *                      - contributionId
 *                  properties:
 *                      comment:
 *                          type: text
 *                          example: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vehicula fringilla cursus.
 *                      userId:
 *                          type: string
 *                          example: 48e40a9c-c5e9-4d63-9aba-b77cdf4ca67b
 *                      contributionId:
 *                          type: integer
 *                          example: 1
 *      responses:
 *        200:
 *          description: Comment Added
 *
 */
router.post(
  '/',
  auth,
  commentController.create.validate,
  commentController.create.create,
  commentController.create.response
)

/**
 * @swagger
 * paths:
 *  /api/v1/comment/1:
 *    put:
 *      summary: Update Comment.
 *      tags:
 *          - COMMENT ENDPOINTS
 *      requestBody:
 *        content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  required:
 *                      - comment
 *                  properties:
 *                      comment:
 *                          type: string
 *                          example: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vehicula fringilla cursus.
 *      responses:
 *        200:
 *          description: Updated
 *
 */
router.put(
  '/:commentId',
  auth,
  commentController.update.validatePayload,
  commentController.update.update,
  commentController.update.response
)

/**
 * @swagger
 * paths:
 *  /api/v1/comment/{contributionId}:
 *    delete:
 *      summary: Delete Comment.
 *      parameters:
 *        - in: path
 *          name: contributionId
 *          schema:
 *             type: integer
 *          required: true
 *          description: ID of the Contribution
 *      tags:
 *          - COMMENT ENDPOINTS
 *      responses:
 *        200:
 *          description: Updated
 *
 */
router.delete(
  '/:commentId',
  auth,
  commentController.destroy.validate,
  commentController.destroy.destroy,
  commentController.destroy.response
)

module.exports = router
