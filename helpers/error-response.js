module.exports = (error) => {
  const isDevelopment = process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development'

  const errorResponse = {
    message: isDevelopment ? error.message : 'Internal Server Error'
  }

  if (isDevelopment) {
    errorResponse.stack = error.stack
  }

  return errorResponse
}
