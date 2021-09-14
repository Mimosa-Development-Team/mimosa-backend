const Status = require('http-status')
const errorCodes = require(APP_ROOT + '/config/error-codes')

describe('config/error-codes.js', () => {
  test('should return error codes', () => {
    expect(errorCodes).toEqual({
      USER_ALREADY_EXISTING: {
        code: Status.BAD_REQUEST,
        message: 'User already existing'
      },
      EMAIL_ALREADY_EXISTING: {
        code: Status.BAD_REQUEST,
        message: 'E-mail address is already an existing user.'
      },
      EXPIRED_AUTH_CODE: {
        code: Status.UNAUTHORIZED, // Expire or invalid token
        message: 'Auth code has expired! Please re-validate authorization'
      }
    })
  })
})
