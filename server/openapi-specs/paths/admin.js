const { content } = require('../helpers')

module.exports = {
  '/api/v1/users': {
    get: {
      tags: [ 'Administration' ],
      summary: 'Search Users by query',
      description: `Find a list users which match the query parameters passed in the url`,
      parameters: [
        { '$ref': '#/components/parameters/populate' },
        { '$ref': '#/components/parameters/limit' },
        { '$ref': '#/components/parameters/page' },
      ],
      responses: {
        '200': { description: 'OK', content: content({ '$ref': '#/components/schemas/Paginated' }) },
        '401': { '$ref': '#/components/responses/401' }, // unauthorized
      },
      // 'x-code-samples': sample.get('/catalog')
    }
  },
  '/api/v1/users/{id}': {
    get: {
      tags: [ 'Administration' ],
      summary: 'Find User by ID',
      parameters: [
        { '$ref': '#/components/parameters/id' },
        // { '$ref': '#/components/parameters/populate' },
      ],
      description: `Finds a User document that has the passed id.`,
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
      parameters: [
        { '$ref': '#/components/parameters/id' },
      ],
      requestBody: {
        description: 'Updated User Profile',
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/User' },       
          },
        },
      },
      description: `Describe the columns of the table with the passed table name.`,
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
      tags: [ 'Administration' ],
      summary: 'Delete User',
      parameters: [
        { '$ref': '#/components/parameters/id' },
      ],
      description: `Removes the single quote associated to the passed id from the database.`,
      responses: {
        '200': { description: 'OK', content: content({ '$ref': '#/components/schemas/Paginated' }) },
        '401': { '$ref': '#/components/responses/401' }, // unauthorized
        '404': { '$ref': '#/components/responses/404' }, // not found
      },
      // 'x-code-samples': sample.get('/catalog/prod')
    },
  },
}