const router = require('express').Router()

const Controller = require('./../library/Controller')
const service = require('./../services/users')
const controller = new Controller('users')

router.route('/login')
  .get(
    controller.decodeBasicAuth,
    async (req, res) => {
      try {
        // console.log(req.email, req.password)
        const { status, data } = await service.login(req.email, req.password)
        const json = controller.formatResponse(req, res, { status, data })
        res.status(status).json(json)
      } catch (error) {
        const json = controller.errorHandler(req, res, error)
        res.status(401).json(json)
      }
    }
  )

router.route('/signup')
  // .all(verifyJWT)
  .all(controller.validateRequestBody(service.jsonSchema))
  .post(
    async (req, res) => {
      try {
        const { status, data } = await service.signup(req.body.email, req.body.password)
        const json = controller.formatResponse(req, res, { status, data })
        res.status(status).json(json)
      } catch (error) {
        const json = controller.errorHandler(req, res, error)
        res.status(json.status).json(json)
      }
    }
  )

router.route('/verify')
  // .all(verifyJWT)
  .all(controller.validateRequestBody(service.jsonSchema))
  .put(
    async (req, res) => {
      try {
        const { status, data } = await service.verify(req.body.email)
        const json = controller.formatResponse(req, res, { status, data })
        res.status(status).json(json)
      } catch (error) {
        const json = controller.errorHandler(req, res, error)
        res.status(json.status).json(json)
      }
    }
  )

router.route('/change-password')
	// .all(verifyJWT)
	.all(controller.validateRequestBody(service.jsonSchema))
	.put(async (req, res) => {
		try {
			const { status, data } = await service.changePassword(req.body.email, req.body.newPassword)
			const json = controller.formatResponse(req, res, { status, data })
			res.status(status).json(json)
		} catch (error) {
			const json = controller.errorHandler(req, res, error)
			res.status(json.status).json(json)
		}
	})

router.route('/')
  // .all(verifyJWT)
  .get(
    // checkJWTScopes(['read:users'], options),
    async (req, res) => {
      try {
        const { status, data } = await service.search(req.query)
        const json = controller.formatResponse(req, res, { status, data })
        res.status(status).json(json)
      } catch (error) {
        const json = controller.errorHandler(req, res, error)
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
        const { status, data } = await service.findById(req.params.id, req.query)
        const json = controller.formatResponse(req, res, { status, data })
        res.status(status).json(json)
      } catch (error) {
        const json = controller.errorHandler(req, res, error)
        res.status(json.status).json(json)
      }
    }
  )
  .put(
    // checkJWTScopes(['update:users'], options),
    // controller.validateRequestBody(service.jsonSchema),
    async (req, res) => {
      try {
        const { status, message, data } = await service.update(req.body, req.params.id)
        const json = controller.formatResponse(req, res, { status, data, message })
        res.status(status).json(json)
      } catch (error) {
        const json = controller.errorHandler(req, res, error)
        res.status(json.status).json(json)
      }
    }
  )
  .delete(
    // checkJWTScopes(['delete:users'], options),
    async (req, res) => {
      try {
        const { status, data } = await service.remove(req.params.id)
        const json = controller.formatResponse(req, res, { status, data })
        res.status(status).json(json)
      } catch (error) {
        const json = controller.errorHandler(req, res, error)
        res.status(json.status).json(json)
      }
    }
  )

  module.exports = router
