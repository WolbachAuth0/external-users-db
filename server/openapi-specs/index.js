/**
 * This module generates the documentation object from the config variables and returns it to be parsed
 * by the swagger-ui library later on in the code.
 */

// https://swagger.io/specification
const specification = {
  openapi: '3.0.3',
  info: {
    title: 'Okta | Auth0 Custom DB Example API',
    description: require('./description'),
    termsOfService: `${process.env.BASE_URL}/terms`,
    contact: {
      name: 'Aaron Wolbach',
      email: 'aaron.wolbach@okta.com',
      url: `${process.env.BASE_URL}/support`
    },
    license: {
      name: 'UNLICENSED',
      // 'https://opensource.org/licenses/MIT'
      url: 'https://choosealicense.com/licenses/',
    },
    version: '1.0',
    'x-logo': {
      url: '/public/images/okta-auth0-logo.svg',
      altText: 'Okta | Auth0'
    }
  },
  servers: [
    {
      url: `${process.env.BASE_URL}/api/v1`,
      description: `Production server`
    }
  ],
  paths: require('./paths'),
  components: {
    schemas: require('./components/schemas'),
    parameters: require('./components/parameters'),
    securitySchemes: require('./components/security').schemes,
    requestBodies: require('./components/requests'),
    responses: require('./components/responses'),
    // headers: {},
    // examples: {}
    // links: {},
    // callbacks: {}
  },
  // security: [{ ApiKey: [] }],
  // tags: require('./tags').tags,
  // 'x-tagGroups': require('./tags')['x-tagGroups'],
}

module.exports = specification
