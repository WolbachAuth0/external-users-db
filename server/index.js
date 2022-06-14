const express = require('express')
const cors = require('cors')
const serveStatic = require('serve-static')
const enforceHTTPS = require('./middleware/enforceHTTPS')
const helmet = require('helmet')
const path = require('path')

// const { oidcMiddleware, enforceHTTPS } = require('./library/Auth')
const { routerLogger, errorLogger } = require('./library/Logger')

const app = express()

// middleware ...
app.use(express.json())
app.use(routerLogger)
// TODO: decide if you want a whitelist or just have a global API.
app.use(cors())

// https://www.npmjs.com/package/helmet
app.use(helmet({ contentSecurityPolicy: false }))

// force TLS for auth0 - in production only (so I don't have deal with SSL certs in dev)
if (process.env.MODE === 'production') {
  app.use(enforceHTTPS)
}

// serve static assets
app.use('/public', serveStatic(path.join(__dirname, 'public')))

// set up routes
app.use('/', require('./routes/views'))
app.use('/api/v1/users', require('./routes/users'))
app.use('/', require('./routes/errors'))

// express-winston errorLogger AFTER the other routes have been defined.
app.use(errorLogger)

module.exports = app
