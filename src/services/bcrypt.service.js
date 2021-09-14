const bcrypt = require('bcryptjs')
const saltRounds = 10

module.exports = {
  hash: password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds))
  },
  comparePassword: (password, hash) => (
    bcrypt.compareSync(password, hash)
  )
}
