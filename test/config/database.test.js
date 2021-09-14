const database = require(APP_ROOT + '/config/database')

describe('config/database.js', () => {
  test('should return proper database config', () => {
    expect(database).toEqual({
      development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_TYPE,
        define: {
          underscored: true
        },
        dialectOptions: {
          useUTC: true,
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        },
        timezone: '00:00'
      },
      test: {
        username: process.env.DB_USER_TEST,
        password: process.env.DB_PASS_TEST,
        database: process.env.DB_NAME_TEST,
        host: process.env.DB_HOST_TEST,
        port: process.env.DB_PORT_TEST,
        dialect: process.env.DB_TYPE_TEST,
        define: {
          underscored: true
        },
        dialectOptions: {
          useUTC: true
        },
        timezone: '00:00',
        logging: false
      },
      production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_TYPE,
        define: {
          underscored: true
        },
        dialectOptions: {
          useUTC: true
        },
        timezone: '00:00'
      }
    })
  })
})
