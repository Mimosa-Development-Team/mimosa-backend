const indexConfig = require(APP_ROOT + '/config/index')

describe('config/index.js', () => {
  const envCache = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...envCache }
  })

  afterEach(() => {
    jest.clearAllMocks()
    process.env = envCache
  })

  test('should return proper configs', () => {
    expect(indexConfig).toEqual({
      ERROR_CODES: {
        EMAIL_ALREADY_EXISTING: {
          code: 400,
          message: 'E-mail address is already an existing user.'
        },
        EXPIRED_AUTH_CODE: {
          code: 401,
          message: 'Auth code has expired! Please re-validate authorization'
        },
        USER_ALREADY_EXISTING: {
          code: 400,
          message: 'User already existing'
        }
      },
      apiUrl: '',
      appUrl: '',
      authSecret: 'localsecretkey',
      authSession: {
        session: false
      },
      db: {
        database: 'mimosa_test',
        define: {
          underscored: true
        },
        dialect: 'postgres',
        dialectOptions: {
          useUTC: true
        },
        host: 'postgrestest',
        logging: false,
        password: '12345',
        port: '5433',
        timezone: '00:00',
        username: 'postgres'
      },
      env: 'test',
      logging: {
        colorize: false,
        maxFiles: 2,
        maxsize: 102400
      },
      port: '3000',
      timezone: undefined,
      version: '1.0.0'
    })
  })

  test('should use development env if process.env.NODE_ENV is not defined', () => {
    delete process.env.NODE_ENV

    const testIndexConfig = require(APP_ROOT + '/config/index')

    expect(testIndexConfig).toEqual({
      ERROR_CODES: {
        EMAIL_ALREADY_EXISTING: {
          code: 400,
          message: 'E-mail address is already an existing user.'
        },
        EXPIRED_AUTH_CODE: {
          code: 401,
          message: 'Auth code has expired! Please re-validate authorization'
        },
        USER_ALREADY_EXISTING: {
          code: 400,
          message: 'User already existing'
        }
      },
      apiUrl: '',
      appUrl: '',
      authSecret: 'localsecretkey',
      authSession: {
        session: false
      },
      db: {
        database: 'mimosa',
        define: {
          underscored: true
        },
        dialect: 'postgres',
        dialectOptions: {
          useUTC: true,
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        },
        host: 'postgres',
        password: '12345',
        port: '5432',
        timezone: '00:00',
        username: 'postgres'
      },
      env: 'development',
      logging: {
        colorize: false,
        maxFiles: 2,
        maxsize: 102400
      },
      port: '3000',
      timezone: undefined,
      version: '1.0.0'
    })
  })
})
