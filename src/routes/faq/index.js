const express = require('express')
const router = express.Router()

const faqController = require('../../controllers').faq

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
 * /api/v1/faq:
 *   get:
 *     summary: Get List of FAQs.
 *     tags:
 *        - FAQ ENDPOINTS
 *     description: Fetch FAQs
 *     responses:
 *       200:
 *         description: List of FAQs.
 */
router.get('/', faqController.getAll)

/**
 * @swagger
 * /api/v1/faq/{question}:
 *   get:
 *     summary: FAQ Search.
 *     parameters:
 *        - in: path
 *          name: question
 *          schema:
 *             type: string
 *          required: true
 *          description: FAQ to be search
 *     tags:
 *        - FAQ ENDPOINTS
 *     description: Search FAQ
 *     responses:
 *       200:
 *         description: Search for FAQ.
 */
router.get('/:question', faqController.get)

/**
 * @swagger
 * paths:
 *  /api/v1/faq:
 *    post:
 *      summary: Create FAQ
 *      tags:
 *          - FAQ ENDPOINTS
 *      requestBody:
 *        content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  required:
 *                      - topic
 *                      - question
 *                      - shortDetails
 *                      - fullDetails
 *                  properties:
 *                      topic:
 *                          type: text
 *                          example: General Topic 1
 *                      question:
 *                          type: text
 *                          example: Lorem Ipsum Question?
 *                      shortDetails:
 *                          type: text
 *                          example: Short description on this content for this topic
 *                      fullDetails:
 *                          type: text
 *                          example: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vehicula fringilla cursus. In dictum pretium urna, eu ultricies quam ullamcorper id. Nunc pellentesque lectus sed libero vehicula tempus. Integer sit amet vestibulum urna, non ornare leo. Ut in ultrices nisl. Donec pellentesque mollis augue, quis sodales lectus dignissim quis. Proin id ex eget elit ultricies sollicitudin at nec risus. Nullam sed auctor nunc. Sed placerat rutrum convallis. Morbi pellentesque sed mi sit amet porttitor.
 *      responses:
 *        200:
 *          description: FAQ Added
 *
 */
router.post(
  '/',
  faqController.create.validate,
  faqController.create.create,
  faqController.create.response
)

/**
 * @swagger
 * paths:
 *  /api/v1/faq/{faqId}:
 *    put:
 *      summary: Update FAQ
 *      parameters:
 *        - in: path
 *          name: faqId
 *          schema:
 *             type: integer
 *          required: true
 *          description: ID of FAQ
 *      tags:
 *          - FAQ ENDPOINTS
 *      requestBody:
 *        content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  required:
 *                      - topic
 *                      - question
 *                      - shortDetails
 *                      - fullDetails
 *                  properties:
 *                      topic:
 *                          type: text
 *                          example: General Topic 1
 *                      question:
 *                          type: text
 *                          example: Lorem Ipsum Question?
 *                      shortDetails:
 *                          type: text
 *                          example: Short description on this content for this topic
 *                      fullDetails:
 *                          type: text
 *                          example: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vehicula fringilla cursus. In dictum pretium urna, eu ultricies quam ullamcorper id. Nunc pellentesque lectus sed libero vehicula tempus. Integer sit amet vestibulum urna, non ornare leo. Ut in ultrices nisl. Donec pellentesque mollis augue, quis sodales lectus dignissim quis. Proin id ex eget elit ultricies sollicitudin at nec risus. Nullam sed auctor nunc. Sed placerat rutrum convallis. Morbi pellentesque sed mi sit amet porttitor.
 *      responses:
 *        200:
 *          description: FAQ Updated
 *
 */
router.put(
  '/:faqId',
  faqController.update.validatePayload,
  faqController.update.update,
  faqController.update.response
)

/**
 * @swagger
 * paths:
 *  /api/v1/faq/{faqId}:
 *    delete:
 *      summary: Delete FAQ.
 *      parameters:
 *        - in: path
 *          name: faqId
 *          schema:
 *             type: integer
 *          required: true
 *          description: ID of FAQ
 *      tags:
 *          - FAQ ENDPOINTS
 *      responses:
 *        200:
 *          description: Updated
 *
 */
router.delete(
  '/:faqId',
  faqController.destroy.validate,
  faqController.destroy.destroy,
  faqController.destroy.response
)

module.exports = router
