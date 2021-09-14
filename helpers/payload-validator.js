const Ajv = require('ajv').default
const addFormats = require('ajv-formats')

module.exports = (schema, data, options = {}) => {
  const ajv = new Ajv({ allErrors: true, ...options })
  addFormats(ajv, ['email'])

  const validate = ajv.compile(schema)
  const valid = validate(data)

  if (!valid) {
    const validateError = validate.errors[0]
    const dataPath = validateError.dataPath.substring(1)
    const message = dataPath === '' ? `${validateError.message}` : `"${dataPath}" ${validateError.message}`

    return message
  }

  return true
}
