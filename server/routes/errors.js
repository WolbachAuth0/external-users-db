const router = require('express').Router()
const Controller = require('./../library/Controller')
const controller = new Controller('errors')

module.exports = router

router
  .route('/api/*')
  .all((req, res) => {
    // render 404 error as json
    try {
      const status = 404
      const data = {
        message: 'The requested route is not handled by the server. Please see the API documentation for a listing of handled routes.',
        documentation: '/api/docs'
      }
      const json = controller.formatResponse(req, res, { status, data })
      res.status(status).json(json)
    } catch (error) {
      const json = controller.errorHandler(req, res, error)
      res.status(json.status).json(json)
    }
  })

router
  .route('/*')
  .get((req, res) => {
    // render 404 error as html.
    res.status(404).send('<h1>Not Found</h1>')
  })
