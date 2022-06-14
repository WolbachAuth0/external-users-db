const { content } = require('../helpers')

const responses = {
  '200': { description: 'OK', content: content() },
  '201': { description: 'CREATED', content: content() },
  '204': { description: 'NO CONTENT', content: content() },
  '304': { description: 'NOT MODIFIED', content: content() },
  '400': { description: 'BAD REQUEST', content: content() },
  '401': { description: 'UNAUTHORIZED', content: content() },
  '403': { description: 'FORBIDDEN', content: content() },
  '404': { description: 'NOT FOUND', content: content() },
  // '500': { description: 'SERVER ERROR', content: content({ '$ref': '#/components/schemas/netsuiteError' }) },
  '501': { description: 'NOT IMPLEMENTED', content: content() },
}

module.exports = responses
