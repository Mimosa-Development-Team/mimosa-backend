const JWTService = require('../src/services/auth.service')
const { mmUser } = require('../src/database/models')

// usually: "Authorization: Bearer [token]" or "token: [token]"
module.exports = (req, res, next) => {
  let token

  if (req.header('Authorization')) {
    const parts = req.header('Authorization').split(' ')

    if (parts.length === 2) {
      const scheme = parts[0]
      const credentials = parts[1]

      if (/^Bearer$/.test(scheme)) {
        token = credentials
      } else {
        return res
          .status(401)
          .json({ message: 'Format for Authorization: Bearer [token]' })
      }
    } else {
      return res
        .status(401)
        .json({ message: 'Format for Authorization: Bearer [token]' })
    }
  } else {
    next()
  }

  if (token) {
    return JWTService.verify(token, async (err, thisToken) => {
      if (err) return res.status(401).json({ err })
      const verifyUser = await mmUser.findByPk(thisToken.id)
      if (verifyUser) {
        req.token = thisToken
      } else {
        return res
          .status(401)
          .json({ message: 'Unauthorized User' })
      }
      return next()
    })
  }
}

// USAGE
// const auth = require('./src/utils/policy');
// Bring in defined Passport Strategy
// require('./src/services/passport.service')(passport);
// secure your private routes with jwt authentication middleware
// app.all('/api/*', (req, res, next) => auth(req, res, next));
