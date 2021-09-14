const fs = require('fs')
const helpers = require(APP_ROOT + '/helpers')

describe('helpers/load_db_config.js', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return proper database test environment config', () => {
    const spy = jest.spyOn(helpers, 'loadDbConfig')
    const config = spy('test')

    expect(config).toEqual({
      username: 'postgres',
      password: '12345',
      database: 'mimosa_test',
      host: 'postgrestest',
      port: '5433',
      dialect: 'postgres',
      define: { underscored: true },
      dialectOptions: { useUTC: true },
      timezone: '00:00',
      logging: false
    })
  })

  test('should return proper database production environment config', () => {
    const spy = jest.spyOn(helpers, 'loadDbConfig')
    const config = spy('production')

    expect(config).toEqual({
      username: 'postgres',
      password: '12345',
      database: 'mimosa',
      host: 'postgres',
      port: '5432',
      dialect: 'postgres',
      define: { underscored: true },
      dialectOptions: { useUTC: true },
      timezone: '00:00'
    })
  })

  test('should throw error if database.js is not avaible', () => {
    const spy = jest.spyOn(fs, 'existsSync')
    spy.mockReturnValue(false)

    expect(() => {
      helpers.loadDbConfig(process.env.NODE_ENV)
    }).toThrow('Database configuration is required')
  })
})
