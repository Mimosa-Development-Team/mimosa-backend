// This will be our application entry. We'll setup our server here.
const http = require('http')
const normalizePort = require('normalize-port')

const app = require('./app')

const port = normalizePort(process.env.PORT, 10) || 5000

app.set('port', port)
const runningPort = process.env.RUNNING_IN_DOCKER ? process.env.COMPOSE_NODE_PORT : port

const server = http.createServer(app).listen(port, () => {
  console.log(`🤘 Server is up on port ${runningPort}`)
})

server.on('error', function (error) {
  console.log(error)
})
