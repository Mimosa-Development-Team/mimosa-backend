const express = require('express')
const router = express.Router()
const auth = require('../../../lib/policy')
const contributionController = require('../../controllers').contribution

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
 * /api/v1/contribution/questions?page=1&limit=10&orderBy=DESC&userId=null:
 *   get:
 *     summary: Get All Questions.
 *     tags:
 *        - CONTRIBUTION ENDPOINTS
 *     description: Fetch All Question contributions
 *     responses:
 *       200:
 *         description: List of questions.
 */
router.get('/questions', auth, contributionController.getQuestions)
router.get('/questionslist/:contributionId', auth, contributionController.getList)

/**
 * @swagger
 * /api/v1/contribution/question/48e40a9c-c5e9-4d63-9aba-b77cdf4ca67b/ASC?page=1&limit=10:
 *   get:
 *     summary: Get Contributions of User.
 *     tags:
 *        - CONTRIBUTION ENDPOINTS
 *     description: My Contribution of User
 *     responses:
 *       200:
 *         description: List of contributions of user.
 */
router.get('/question/:userId/:orderBy', auth, contributionController.get)

router.get('/question/:contributionId', auth, contributionController.getSingle)

/**
 * @swagger
 * /api/v1/contribution/search?data={search}:
 *   get:
 *     summary: Search Contribution.
 *     parameters:
 *        - in: path
 *          name: search
 *          schema:
 *             type: string
 *          required: true
 *          description: search string
 *     tags:
 *        - CONTRIBUTION ENDPOINTS
 *     description: Fetch Question contributions of User
 *     responses:
 *       200:
 *         description: List of questions of user.
 */
router.get('/search', auth, contributionController.getContributionSearch)

/**
 * @swagger
 * /api/v1/contribution/list/6c73263f-3e26-4518-9fdf-044aa6581f65:
 *   get:
 *     summary: Get Contribution Hierarchy of a Question.
 *     tags:
 *        - CONTRIBUTION ENDPOINTS
 *     description: Fetch Contribution Hierarchy of a Question
 *     responses:
 *       200:
 *         description: List of contribution hierarchy.
 */
router.get(
  '/list/:contributionId/:userId',
  auth,
  contributionController.getContributionList
)
/**
 * @swagger
 * paths:
 *  /api/v1/contribution:
 *    post:
 *      summary: Create Published or Draft Contribution.
 *      tags:
 *          - CONTRIBUTION ENDPOINTS
 *      requestBody:
 *        content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  required:
 *                      - category
 *                      - subject
 *                      - details
 *                      - tags
 *                      - userId
 *                      - version
 *                      - status
 *                      - author
 *                  properties:
 *                      category:
 *                          type: string
 *                          example: question
 *                      subject:
 *                          type: string
 *                          example: Question 6
 *                      details:
 *                          type: string
 *                          example: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vehicula fringilla cursus.
 *                      tags:
 *                          type: array
 *                          example: ["Tag 1", "Tag 2", "Tag 3"]
 *                      userId:
 *                          type: string
 *                          example: 48e40a9c-c5e9-4d63-9aba-b77cdf4ca67b
 *                      version:
 *                          type: string
 *                          example: 1.0
 *                      status:
 *                          type: string
 *                          example: publish
 *                      author:
 *                          type: array
 *                          example: [{"id": "48e40a9c-c5e9-4d63-9aba-b77cdf4ca67b","name": "Developer Test"},{"name": "Doe John"}]
 *      responses:
 *        200:
 *          description: Created
 *
 */
router.post(
  '/',
  auth,
  contributionController.create.validate,
  contributionController.create.create,
  contributionController.create.response
)

router.put(
  '/:contributionId',
  auth,
  contributionController.updateAll.validatePayload,
  contributionController.updateAll.update,
  contributionController.updateAll.response
)

/**
 * @swagger
 * paths:
 *  /api/v1/contribution/status/1:
 *    put:
 *      summary: Update Status of Contribution.
 *      tags:
 *          - CONTRIBUTION ENDPOINTS
 *      requestBody:
 *        content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  required:
 *                      - status
 *                  properties:
 *                      status:
 *                          type: string
 *                          example: publish
 *      responses:
 *        200:
 *          description: Updated
 *
 */
router.put(
  '/status/:contributionId',
  auth,
  contributionController.update.validatePayload,
  contributionController.update.update,
  contributionController.update.response
)

/**
 * @swagger
 * /api/v1/contribution/tags:
 *   get:
 *     summary: Get List of Tags.
 *     tags:
 *        - CONTRIBUTION ENDPOINTS
 *     description: Fetch Tags
 *     responses:
 *       200:
 *         description: List of Tags.
 */
router.get('/tags', auth, contributionController.getContributionTags)

/**
 * @swagger
 * paths:
 *  /api/v1/contribution/{contributionId}:
 *    delete:
 *      summary: Delete CONTRIBUTION.
 *      parameters:
 *        - in: path
 *          name: contributionId
 *          schema:
 *             type: integer
 *          required: true
 *          description: ID of CONTRIBUTION
 *      tags:
 *          - CONTRIBUTION ENDPOINTS
 *      responses:
 *        200:
 *          description: Updated
 *
 */
router.delete(
  '/:contributionId',
  auth,
  contributionController.destroy.validate,
  contributionController.destroy.destroy,
  contributionController.destroy.response
)

module.exports = router
