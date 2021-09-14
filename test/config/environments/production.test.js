const production = require(APP_ROOT + '/config/environments/production')

describe('config/environments/production.js', () => {
  test('should return proper production environments', () => {
    expect(production).toEqual({
      apiUrl: process.env.API_BASE_URL,
      appUrl: process.env.APP_BASE_URL,
      version: process.env.APP_VERSION,
      port: process.env.PORT || 5000,
      timezone: process.env.TIMEZONE,
      logging: {
        maxsize: 100 * 1024,
        maxFiles: 2,
        colorize: false
      },
      authSecret: process.env.JWT_SECRET,
      authSession: {
        session: false
      }
    })
  })
})
