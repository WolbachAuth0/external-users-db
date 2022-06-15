const Validator = require('jsonschema').Validator

/**
 * @typedef {Object} ExpressRequest The HTTP request object passed to an Express.js route.
 */

/**
 * @typedef {Object} ExpressResponse The HTTP response object passed to an Express.js route.
 */


/**
 * Handles the enqueuing of tasks, formatting of responses and errors for a a set of endpoints. 
 *
 * @alias module:Models.Controller
 */
class Controller {
  constructor (name='default') {
    this._name = name
    this._validator = new Validator()
  }

  /**
   * A hash-map keyed by HTTP status codes to the status text and success boolean.
   * 
   * @static
   * @constant
   * @type {object} A hash-map of HTTP codes
   */
  static get httpCodes () {
    return {
      200: { success: true, text: 'OK' },
      202: { success: true, text: 'ACCEPTED' },
      201: { success: true, text: 'CREATED' },
      204: { success: true, text: 'NO CONTENT' },
      207: { success: true, text: 'MULTI-STATUS' },
      304: { success: false, text: 'NOT MODIFIED' },
      400: { success: false, text: 'BAD REQUEST' },
      401: { success: false, text: 'UNAUTHORIZED' },
      403: { success: false, text: 'FORBIDDEN' },
      404: { success: false, text: 'NOT FOUND' },
      409: { success: false, text: 'CONFLICT' },
      500: { success: false, text: 'INTERNAL SERVER ERROR' },
      501: { success: false, text: 'NOT IMPLEMENTED' },
    }
  }

  /**
   * A hash-map keyed by HTTP verb and returning associate CRUD verb
   * 
   * @static
   * @constant
   * @type {object} A hash-map mapping CRUD operations to HTTP methods.
   */
  static get cruds () {
    return {
      POST: 'create',
      GET: 'read',
      PUT: 'update',
      DELETE: 'delete',
    }
  }

  get name () { return this._name }
  get validator () { return this._validator }

  decodeBasicAuth (req, res, next) {
    // console.log('decoding ... ', req.headers.authorization)
    try {
      const encoded = req.headers.authorization.split(' ')[1]
      const decoded = Buffer.from(encoded, 'base64').toString()
      req.email = decoded.split(':')[0]
      req.password = decoded.split(':')[1]
      next()
    } catch (error) {
      const status = 401
      const data = JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)))
      const json = this.formatResponse(req, res, { status, data })
      res.status(status).json(json)
    }
  }

  /**
   * Format the JSON response with meta data and respond to requester
   *
   * @static
   * @param {Object} req Express.js request object. https://expressjs.com/en/4x/api.html#req
   * @param {Object} res Express.js response object https://expressjs.com/en/4x/api.html#res
   * @param {Object} param
   * @param {Number} param.status The HTTP status code
   * @param {Object} param.data The response data
   */
  formatResponse (req, res, { status, data }) {
    status = Controller.httpCodes.hasOwnProperty(status) ? status : 500
    const stat = Controller.httpCodes[status]
    const response = {
      method: req.method.toUpperCase(),
      controler: this.name,
      resource: req.baseUrl || '/',
      success: stat.success,
      status,
      statusText: stat.text,
      data
    }
    return response
  }

  /**
   * 
   * @static
   * @param {Object} req Express.js request object. https://expressjs.com/en/4x/api.html#req
   * @param {Object} res Express.js response object https://expressjs.com/en/4x/api.html#res
   * @param {Error} error The error that was thrown.
   * @returns 
   */
  errorHandler (req, res, error) {
    // TODO: set different status codes based on the error message
    const status = Controller.httpCodes[500]
    const response = {
      method: req.method.toUpperCase(),
      resource: req.baseUrl,
      success: status.success,
      status: 500,
      statusText: status.text,
      data: {
        message: error.message,
        body: req.body
      }
    }
    return response
  }

  /**
   * https://www.npmjs.com/package/jsonschema
   * @param {*} schema 
   * @param {*} id 
   */
  addSchema (schema, id) {
    this.validator.addSchema(schema, id)
  }

  /**
   * https://www.npmjs.com/package/jsonschema
   * @param {*} body 
   * @param {*} schema 
   * @returns 
   */
  validateRequestBody (schema) {
    const self = this
    return function (req, res, next) {
      const validation = self.validator.validate(req.body, schema)
      if (validation.valid) {
        next()
      } else {
        const status = 400
        const message = 'Request body does not match schema'
        const data = Object.assign({ message }, validation)
        const json = self.formatResponse(req, res, { status, data })
        res.status(status).json(json)
      }
    }
  }
}

module.exports = Controller
