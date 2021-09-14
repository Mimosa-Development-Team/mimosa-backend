const express = require('express')
const router = express.Router()
const auth = require('../../../lib/policy')
const usersController = require('../../controllers').users

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
 * /api/v1/users:
 *   get:
 *     description: Fetch Pagination Users
 *     tags:
 *        - USER ENDPOINTS
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
router.get('/', auth, usersController.getAll)
/**
 * @swagger
 * /api/v1/users/list:
 *   get:
 *     description: Fetch Users list
 *     tags:
 *        - USER ENDPOINTS
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
router.get('/list', auth, usersController.getUser)

/**
 * @swagger
 * /api/v1/users/ee5278b8-6731-40ac-8fbe-b9d734df4a02:
 *   get:
 *     summary: Get Single User.
 *     tags:
 *        - USER ENDPOINTS
 *     description: Fetch Single User.
 *     responses:
 *       200:
 *         description: A single user.
 */
router.get('/:userId', auth, usersController.get)

router.put(
  '/',
  auth,
  usersController.updateNotification.validatePayload,
  usersController.updateNotification.update,
  usersController.updateNotification.response
)

router.put(
  '/email/:userId',
  usersController.updateEmail.validatePayload,
  usersController.updateEmail.update,
  usersController.updateEmail.response
)

router.put(
  '/:userId',
  auth,
  usersController.update.validatePayload,
  usersController.update.update,
  usersController.update.response
)

/**
 * @swagger
 * paths:
 *  /api/v1/users/auth:
 *    post:
 *      summary: Authenticate or create a new user.
 *      tags:
 *        - USER ENDPOINTS
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - token
 *              properties:
 *                token:
 *                  type: string
 *                  example: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdF9oYXNoIjoiZEJqMDZTdWc2dVhvQXBRWl8tcHhndyIsImF1ZCI6IkFQUC1ZQjBRMFhJTUhMNU1ZUzBCIiwic3ViIjoiMDAwMC0wMDAzLTI2NTEtNTkxMCIsImF1dGhfdGltZSI6MTYxNDE1NDI0MCwiaXNzIjoiaHR0cHM6Ly9zYW5kYm94Lm9yY2lkLm9yZyIsImV4cCI6MTcxNTE4MTEwOCwiZ2l2ZW5fbmFtZSI6IkNsb3lkIiwiaWF0IjoxNjE0Mjk5MjAwLCJmYW1pbHlfbmFtZSI6IkFsY2FudGFyYSIsImp0aSI6ImNkYTYwNzZmLTk2YzEtNDc5OS05N2UxLWEwNGQ2MDNkZGNmMCJ9.xfXOgSxpsw07f3FcHuB4b4ctV1jXrtfI7rI_XEEqu3g
 *      responses:
 *        200:
 *          description: Created
 */
router.post(
  '/auth',
  auth,
  usersController.auth.validateJwt,
  usersController.auth.validateUser,
  usersController.auth.auth,
  usersController.auth.response
)

router.post(
  '/signup',
  auth,
  usersController.create.validatePayload,
  usersController.create.create,
  usersController.create.response
)

router.delete(
  '/:userId',
  auth,
  usersController.destroy.validate,
  usersController.destroy.destroy,
  usersController.destroy.response
)

module.exports = router
