const UserModel = require('./../models/user')
const moment = require('moment')

/**
 * @typedef {Object} ServiceResponse
 * @property {number} status The HTTP status to return
 * @property {*} data the data to return from the method 
 */

/**
 * 
 */
class UserService {
  /**
   * The JSON schema of the User model. Used by both the API documentation 
   * and the request body validation middleware.
   * @static
   * @returns {Object}
   */
  static get jsonSchema () {
    return UserModel.jsonSchema()
  }

  /**
   * Check user credentials.
   * 
   * @static
   * @async
   * @param {string} email The users email
   * @param {string} password The users unhashed password
   * @returns {ServiceResponse} 
   */
  static async login (email, password) {
    try {
      const user = await UserModel.findOne({ email }).exec()
      if (!user) {
        return { status: 401, data: null }
      }

      // compare hashes
      const authenticated = await UserModel.comparePassword(password, user.hash)
      const status = authenticated ? 200 : 401
      const data = authenticated ? user.format() : null
      return { status, data }
    } catch (error) {
      console.error(error)
      return { status: 401, data: null }
    }
  }

  /**
   * Adds a new user to the database.
   * 
   * @static
   * @async
   * @param {string} email The users email
   * @param {string} password The users unhashed password
   * @returns {ServiceResponse} 
   */
  static async signup (email, password) {
    const hash = await UserModel.hashPassword(password)
    const user = new UserModel({ email, hash, verified: false })
    const saved = await user.save()
    const data = saved.format()
    return { status: 201, data }
  }

  /**
   * Used to verify a user's email address
   * 
   * @static
   * @async
   * @param {string} email The users email
   * @returns {ServiceResponse} 
   */
  static async verify (email) {
    const user = await UserModel.findOne({ email }).exec()
    if (!user) {
      return { status: 404, data: `User ${email} was not found.` }
    }
    user.verified = true
    const updated = await user.save()
    return { status: 200, data: updated.format() }
  }

  /**
   * Handles a change password request.
   * 
   * @static
   * @async
   * @param {string} email The users email
   * @param {string} newPassword The users new unhashed password
   * @returns {ServiceResponse} 
   */
  static async changePassword (email, newPassword) {
    const user = await UserModel.findOne({ email }).exec()
    if (!user) {
      return { status: 404, data: `User ${email} was not found.` }
    }
    user.verified = true
    user.hash = await UserModel.hashPassword(newPassword)
    const updated = await user.save()
    return { status: 200, data: updated.format() }
  }

  /**
   * List all users in the database which match the query. 
   * 
   * @static
   * @async
   * @param {Object} query An object with query parameters
   * @returns {ServiceResponse}
   */
  static async search (query) {
    const { filter, options } = UserModel.parseQuery(query)
    const found = await UserModel.paginate(filter, options)
    found.docs = found.docs.map(document => document.format())
    return { status: 200, data: found }
  }

  /**
   * Find a specific user by user id.
   * 
   * @static
   * @async
   * @param {string} id The user's unique identifier
   * @returns {ServiceResponse}
   */
  static async findById (id) {
    const found = await UserModel.findById(id)
    const status = found ? 200 : 404
    const data = found ? found.format() : {}
    return { status, data }
  }

  /**
   * Updates and existing user record associated with the passed identifier.
   * 
   * @static
   * @async
   * @param {*} input The new data to update
   * @param {*} id The user's unique identifier
   * @returns {ServiceResponse}
   */
  static async update (input, id) {
    const found = await UserModel.findById(id)
    const body = UserModel.parseInput(input)

    if (!found) {
      return { status: 404, data: `User with id=${id} was not found.` }
    }

    found.patch(body)
    const updated = await found.save()
    return { status: 200, data: updated.format() }
  }

  /**
   * Delete an existing user associated to the passed identifier.
   * 
   * @static
   * @async
   * @param {string} id The users unique identifier. 
   * @returns {ServiceResponse}
   */
  static async remove (id) {
    const removed = await UserModel.findByIdAndRemove(id)
    const status = 200
    const now = moment()
    const data = {
      id: removed.format().id,
      deletedAt: now.toISOString()
    }
    return { status, data }
  }
}
module.exports = UserService
