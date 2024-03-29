const jwt = require('jsonwebtoken')

const secret = process.env.NODE_ENV === 'development' ? process.env.JWT_SECRET : 'secret'

module.exports = {
  issue: (payload) => jwt.sign(payload, secret, { expiresIn: '30d' }),
  verify: (token, cb) => jwt.verify(token, secret, {}, cb)
}
