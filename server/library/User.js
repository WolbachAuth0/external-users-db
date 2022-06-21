const bcrypt = require('bcrypt')

class User {
  constructor () {}

  // getters

  // setters

  static loginSchema () {
    return {
      type: 'object',
      description: 'A User profile document',
      required: [ 'email', 'password' ],
      properties: {
        email: { type: 'string', writeOnly: true, example: 'abraham.lincoln@gmail.com', description: 'The user\'s email address' },
        password: { type: 'string', writeOnly: true, example: 'MrPre$ident1861', description: 'The user\'s password.' }
      }
    }
  }

  static verifyEmailSchema () {
    return {
      type: 'object',
      description: 'A User profile document',
      required: [ 'email' ],
      properties: {
        email: { type: 'string', writeOnly: true, example: 'abraham.lincoln@gmail.com', description: 'The user\'s email address' }
      }
    }
  }

  static changePasswordSchema () {
    return {
      type: 'object',
      description: 'A User profile document',
      required: [ 'email', 'newPassword' ],
      properties: {
        email: { type: 'string', writeOnly: true, example: 'abraham.lincoln@gmail.com', description: 'The user\'s email address' },
        newPassword: { type: 'string', writeOnly: true, example: 'MrPre$ident1861' }
      }
    }
  }

  static jsonSchema () {
    return {
      type: 'object',
      description: 'A User profile document',
      required: [ 'email', 'password' ],
      properties: {
        id: { type: 'string', readOnly: true, description: 'The unique identifier of this document.', readOnly: true },
        email: { type: 'string', example: 'abraham.lincoln@gmail.com', description: 'The user\'s email address' },
        verified: { type: 'boolean', example: false, description: 'Has the user verified his or her email address?' },
        password: { type: 'string', writeOnly: true, example: 'MrPre$ident1861' },
        profile: { 
          type: 'object',
          description: 'A collection of profile information on the user',
        },
        createdAt: { type: 'string', readOnly: true, description: 'The date and time that this document was added to the database.' },
        updatedAt: { type: 'string', readOnly: true, description: 'The data and time that this document was last updated.' },
      }
    }
  }

  static async hashPassword (password, saltRounds=10) {
    try {
      const salt = await bcrypt.genSalt(saltRounds)
      const hash = await bcrypt.hash(password, salt)
      return hash
    } catch (error) {
      console.log(error)
      return null
    }
  }

  static async comparePassword (password, hash) {
    try {
      return await bcrypt.compare(password, hash)
    } catch (error) {
      console.log(error)
      return false
    }
  }

  static parseQuery (query) {
    let filter = {}
    if (query.email) {
      filter.email = { $regex: query.email, $options: 'i' }
    }

    const options = {
      page: parseInt(query.page ?? 1),
      limit: parseInt(query.limit ?? 50),
      populate: ''
    }
    // filter is a mongo query ... see https://www.mongodb.com/docs/manual/tutorial/query-documents/
    return { filter, options }
  }

  format () {
    const formatted = {
      id: this._id,
      email: this.email,
      verified: this.verified,
      profile: this.profile,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      revision: this._v
    }
    return formatted
  }
}

module.exports = User
