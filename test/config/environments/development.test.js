const development = require(APP_ROOT + '/config/environments/development')

describe('config/environments/development.js', () => {
  test('should return proper development environments', () => {
    expect(development).toEqual({
      apiUrl: process.env.API_BASE_URL,
      appUrl: process.env.APP_BASE_URL,
      version: process.env.APP_VERSION,
      port: process.env.PORT || 5000,
      timezone: process.env.TIMEZONE,
      logging: {
        maxsize: 100 * 1024, // 100mb
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
