const path = require('path')
const mode = process.argv[2]
/**
 * HEROKU BEST PRACTICES
 * https://devcenter.heroku.com/articles/node-best-practices
 */
switch(mode) {
  case 'dev':
    require('dotenv').config({ path: path.join(__dirname, './.env.dev') })
    break;
  case 'local':
    require('dotenv').config({ path: path.join(__dirname, './.env.local') })
    break
  default:
    // read environment vars from heroku settings - not from .env.prod file
    // require('dotenv').config({ path: path.join(__dirname, './.env.prod') })
}

const { logger } = require('./server/library/Logger')
const app = require('./server')
const Database = require('./server/library/Database.js')

startup(app)

/**
 * Startup the server
 */
async function startup(app) {
  logger.info(`starting app in ${mode} mode.`)
  logger.info(`loaded environment variables from ${process.env.MODE} settings.`)

  // connect to database
  const database = new Database(process.env.DB_CONNECTION_STRING)
  try {
    await database.connect()
  } catch (error) {
    logger.warn('An error occurred while connecting to database.')
    logger.error(error)
  }
  
  // gracefully handle shutdown
  process.on('SIGTERM', async () => { await shutdown(database) })
  process.on('SIGUSR2', async () => { await shutdown(database) })

  const port = process.env.PORT || 5000
  // listen to requests
  app.listen(port, () => {
    logger.info(`Application started in ${process.env.MODE} mode`)
    logger.info(`Express.js server is running on port: ${port}`)
  })
}

/**
 * Gracefully stop the server
 */
async function shutdown(database) {
  try {
    logger.info(`Initiate graceful shutdown ...`)
    await database.disconnect()
    logger.info('Shutdown complete.')
  } catch (error) {
    logger.info('Graceful shutdown wasn\'t graceful ...')
    console.error(error)
  }
  process.kill(process.pid, 'SIGUSR2')
  process.exit()
}

module.exports = {
  startup,
  shutdown
}