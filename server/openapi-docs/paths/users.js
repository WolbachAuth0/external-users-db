const { content } = require('./../helpers')

module.exports = {
  '/api/v1/users/search': {
    get: {
      // tags: [ 'Custom DB Action' ],
      summary: 'Search Users',
      description: `Find a list users which match the query parameters passed in the url`,
      security: [
        { Access_Token: [] }
      ],
      parameters: [
        { '$ref': '#/components/parameters/email' },
        { '$ref': '#/components/parameters/populate' },
        { '$ref': '#/components/parameters/limit' },
        { '$ref': '#/components/parameters/page' },
      ],
      responses: {
        '200': { description: 'OK', content: content({ '$ref': '#/components/schemas/Paginated' }) },
        '400': { '$ref': '#/components/responses/400' },
        '401': { '$ref': '#/components/responses/401' }, // unauthorized
      },
      // 'x-code-samples': sample.get('/catalog')
    }
  },
  '/api/v1/users/verify': {
    put: {
      // tags: [ 'Custom DB Action' ],
      summary: 'Verify Email',
      description: `Verifies a user's email address.`,
      security: [
        { Access_Token: [] }
      ],
      requestBody: { '$ref': '#/components/requestBodies/VerifyEmail' },
      responses: {
        '200': { description: 'OK', content: content({ '$ref': '#/components/schemas/User' }) },
        '400': { '$ref': '#/components/responses/400' }, // bad request
        '401': { '$ref': '#/components/responses/401' }, // unauthorized
        '404': { '$ref': '#/components/responses/404' }, // not found
      },
      // 'x-code-samples': sample.get('/catalog')
    }
  },
  '/api/v1/users/change-password': {
    put: {
      // tags: [ 'Custom DB Action' ],
      summary: 'Change Password',
      description: `Changes the password of the user associated to the email address in the request body.`,
      security: [
        { Access_Token: [] }
      ],
      requestBody: { '$ref': '#/components/requestBodies/ChangePassword' },
      responses: {
        '200': { description: 'OK', content: content({ '$ref': '#/components/schemas/User' }) },
        '400': { '$ref': '#/components/responses/400' }, // bad request
        '401': { '$ref': '#/components/responses/401' }, // unauthorized
        '404': { '$ref': '#/components/responses/404' }, // not found
      },
      // 'x-code-samples': sample.get('/catalog')
    }
  },
  '/api/v1/users/login': {
    post: {
      // tags: [ 'Custom DB Action' ],
      summary: 'Login User',
      description: `Attempts to log a user in. User\'s email and password credentials are extracted from the 
      request body.`,
      security: [
        { Access_Token: [] }
      ],
      requestBody: { '$ref': '#/components/requestBodies/LoginUser' },
      responses: {
        '200': { description: 'OK', content: content({ '$ref': '#/components/schemas/User' }) },
        '401': { '$ref': '#/components/responses/401' },
      },
      // 'x-code-samples': sample.get('/catalog')
    }
  },
  '/api/v1/users/signup': {
    post: {
      // tags: [ 'Custom DB Action' ],
      summary: 'Sign Up User',
      description: `Signs up a new user with the email and password provided in the request body.`,
      security: [
        { Access_Token: [] }
      ],
      requestBody: { '$ref': '#/components/requestBodies/SignupUser' },
      responses: {
        '200': { description: 'OK', content: content({ '$ref': '#/components/schemas/User' }) },
        '400': { '$ref': '#/components/responses/400' }, // bad request
        '401': { '$ref': '#/components/responses/401' }, // unauthorized
      },
      // 'x-code-samples': sample.get('/catalog')
    }
  },
  '/api/v1/users/{id}': {
    get: {
      tags: [ 'Administration' ],
      summary: 'Find User by ID',
      description: `Finds a User document that has the passed id.`,
      security: [
        { Access_Token: [] }
      ],
      parameters: [
        { '$ref': '#/components/parameters/id' },
        // { '$ref': '#/components/parameters/populate' },
      ],
      responses: {
        '200': { description: 'OK', content: content({ '$ref': '#/components/schemas/User' }) },
        '401': { '$ref': '#/components/responses/401' }, // unauthorized
        '404': { '$ref': '#/components/responses/404' }, // not found
      },
      // 'x-code-samples': sample.get('/catalog/prod')
    },
    put: {
      tags: [ 'Administration' ],
      summary: 'Update User',
      description: `Describe the columns of the table with the passed table name.`,
      security: [
        { Access_Token: [] }
      ],
      parameters: [
        { '$ref': '#/components/parameters/id' },
      ],
      requestBody: { '$ref': '#/components/requestBodies/UpdateUser' },
      responses: {
        '200': { description: 'OK', content: content({ '$ref': '#/components/schemas/Paginated' }) },
        '400': { '$ref': '#/components/responses/400' }, // bad request
        '401': { '$ref': '#/components/responses/401' }, // unauthorized
        '404': { '$ref': '#/components/responses/404' }, // not found
        // '500': { '$ref': '#/components/responses/500' }
      },
      // 'x-code-samples': sample.get('/catalog/prod')
    },
    delete: {
      // tags: [ 'Custom DB Action' ],
      summary: 'Delete User',
      description: `Removes the single quote associated to the passed id from the database.`,
      security: [
        { Access_Token: [] }
      ],
      parameters: [
        { '$ref': '#/components/parameters/id' },
      ],
      responses: {
        '200': { description: 'OK', content: content({ '$ref': '#/components/schemas/Paginated' }) },
        '401': { '$ref': '#/components/responses/401' }, // unauthorized
        '404': { '$ref': '#/components/responses/404' }, // not found
      },
      // 'x-code-samples': sample.get('/catalog/prod')
    },
  },
}