const { content } = require('../helpers')

module.exports = {
  '/api/v1/users/login': {
    get: {
      tags: [ 'Auth' ],
      summary: 'Login User',
      description: `Attempts to log a user in. User credentials are extracted from the 
      Basic Auth Scheme. The basusername (email) and password.`,
      security: [
        { Basic_Auth: [ 'username', 'password' ] }
      ],
      responses: {
        '200': { description: 'OK', content: content({ '$ref': '#/components/schemas/User' }) },
        '401': { '$ref': '#/components/responses/401' }, // unauthorized
      },
      // 'x-code-samples': sample.get('/catalog')
    }
  },

  '/api/v1/users': {
    get: {
      tags: [ 'Auth' ],
      summary: '',
      description: `Find a list users which match the query parameters passed in the url`,
      responses: {
        '200': { description: 'OK', content: content({ '$ref': '#/components/schemas/Paginated' }) },
        '400': { '$ref': '#/components/responses/400' }, // bad request
        '401': { '$ref': '#/components/responses/401' }, // unauthorized
        '404': { '$ref': '#/components/responses/404' }, // not found
      },
      // 'x-code-samples': sample.get('/catalog')
    }
  },
  '/api/v1/users/signup': {
    post: {
      tags: [ 'Auth' ],
      summary: 'Sign Up User',
      description: `Signs up a new user with the email and password provided in the basic auth.`,
      security: [
        { Basic_Auth: [] }
      ],
      requestBody: {
        description: 'User to add to the system',
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/User' },       
          },
        },
      },
      responses: {
        '200': { description: 'OK', content: content({ '$ref': '#/components/schemas/User' }) },
        '400': { '$ref': '#/components/responses/400' }, // bad request
        '401': { '$ref': '#/components/responses/401' }, // unauthorized
        '404': { '$ref': '#/components/responses/404' }, // not found
      },
      // 'x-code-samples': sample.get('/catalog')
    }
  },
}