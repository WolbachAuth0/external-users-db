const User = require('./../../library/User')

module.exports = {
  User: User.jsonSchema(),
  VerifyEmail: User.verifyEmailSchema(),
  ChangePassword: User.changePasswordSchema(),
  Paginated: {
    type: 'object',
    description: '',
    properties: {
      docs: {
        type: 'array',
        description: 'List of documents matching the query.',
        items: {
          oneOf: [
            { '$ref': '#/components/schemas/User' }
          ]
        }
      },
      totalDocs: { type: 'integer', description: '' },
      limit: { type: 'integer', description: '' },
      totalPages: { type: 'integer', description: '' },
      page: { type: 'integer', description: '' },
      pagingCounter: { type: 'integer', description: '' },
      hasPrevPage: { type: 'boolean', description: '' },
      hasNextPage: { type: 'boolean', description: '' },
      prevPage: { type: ['integer', 'null'], description: '' },
      nextPage: { type: ['integer', 'null'], description: '' },
    }
  }
}