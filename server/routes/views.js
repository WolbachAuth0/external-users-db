const router = require('express').Router()
const Controller = require('./../library/Controller')
const controller = new Controller('home')

const path = require('path')
const specification = require('./../openapi-docs')

module.exports = router

// TODO: if the user is authenticated and has an administrator role, show the FULL api-specification.
router
  .route('/')
  .get((req, res) => {
    // server/openapi-specs/redoc.html
    res.sendFile(path.join(__dirname, '../views/redoc.html'))
  })

router.route('/hello')
  .get((req, res) => {
    res.status(200).json({ hello: 'world!' })
  })

// TODO: if the user is authenticated and has an administrator role, show the FULL api-specification.
router
  .route('/api/v1/specification')
  .get((req, res) => {
    // req.oidc.isAuthenticated()
    try {
      const status = 200
      res.status(status).json(specification)
    } catch (error) {
      const json = Controller.errorHandler(req, res, error)
      res.status(json.status).json(json)
    }
  })
