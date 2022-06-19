const router = require('express').Router()

const Controller = require('./../library/Controller')
const Service = require('./../services/users')
const controller = new Controller('users')

module.exports = router

router.route('/login')
  .get(
    Controller.decodeBasicAuth,
    async (req, res) => {
      try {
        // console.log(req.email, req.password)
        const { status, data } = await Service.login(req.email, req.password)
        const json = Controller.formatResponse(req, res, { status, data })
        res.status(status).json(json)
      } catch (error) {
        const json = Controller.errorHandler(req, res, error)
        res.status(401).json(json)
      }
    }
  )

router.route('/signup')
  // .all(verifyJWT)
  .post(
    controller.validateRequestBody(Service.jsonSchema),
    async (req, res) => {
      try {
        const { status, data } = await Service.signup(req.body.email, req.body.password)
        const json = Controller.formatResponse(req, res, { status, data })
        res.status(status).json(json)
      } catch (error) {
        const json = Controller.errorHandler(req, res, error)
        res.status(json.status).json(json)
      }
    }
  )

router.route('/verify')
  // .all(verifyJWT)
  .put(
    controller.validateRequestBody(Service.verifyEmailSchema),
    async (req, res) => {
      try {
        const { status, data } = await Service.verify(req.body.email)
        const json = Controller.formatResponse(req, res, { status, data })
        res.status(status).json(json)
      } catch (error) {
        const json = Controller.errorHandler(req, res, error)
        res.status(json.status).json(json)
      }
    }
  )

router.route('/change-password')
	// .all(verifyJWT)
	.put(
    controller.validateRequestBody(Service.changePasswordSchema),
    async (req, res) => {
      try {
        const { status, data } = await Service.changePassword(req.body.email, req.body.newPassword)
        const json = Controller.formatResponse(req, res, { status, data })
        res.status(status).json(json)
      } catch (error) {
        const json = Controller.errorHandler(req, res, error)
        res.status(json.status).json(json)
      }
    }
  )

router.route('/search')
  // .all(verifyJWT)
  .get(
    // checkJWTScopes(['read:users'], options),
    async (req, res) => {
      try {
        const { status, data } = await Service.search(req.query)
        const json = Controller.formatResponse(req, res, { status, data })
        res.status(status).json(json)
      } catch (error) {
        const json = Controller.errorHandler(req, res, error)
        res.status(json.status).json(json)
      }
    }
  )

router.route('/:id')
  // .all(verifyJWT)
  .get(
    // checkJWTScopes(['read:users'], options),
    async (req, res) => {
      try {
        const { status, data } = await Service.findById(req.params.id)
        const json = Controller.formatResponse(req, res, { status, data })
        res.status(status).json(json)
      } catch (error) {
        const json = Controller.errorHandler(req, res, error)
        res.status(json.status).json(json)
      }
    }
  )
  .put(
    // checkJWTScopes(['update:users'], options),
    controller.validateRequestBody(Service.jsonSchema),
    async (req, res) => {
      try {
        const { status, message, data } = await Service.update(req.body, req.params.id)
        const json = Controller.formatResponse(req, res, { status, data, message })
        res.status(status).json(json)
      } catch (error) {
        const json = Controller.errorHandler(req, res, error)
        res.status(json.status).json(json)
      }
    }
  )
  .delete(
    // checkJWTScopes(['delete:users'], options),
    async (req, res) => {
      try {
        const { status, data } = await Service.remove(req.params.id)
        const json = Controller.formatResponse(req, res, { status, data })
        res.status(status).json(json)
      } catch (error) {
        const json = Controller.errorHandler(req, res, error)
        res.status(json.status).json(json)
      }
    }
  )
