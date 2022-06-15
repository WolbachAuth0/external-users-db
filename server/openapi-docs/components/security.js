const schemes = {
  Basic_Auth: {
    type: 'https',
    scheme: 'basic',
    in: 'header',
    name: 'Authorization',
    description: 'Provide username and password base 64 encoded in the Authorization header.'
  },
  Access_Token: {
    type: 'https',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    in: 'header',
    name: 'Authorization',
    description: 'Provide an access token in a JWT format. Access token should be generated an properly signed by the authoriztion server.'
  }
}

module.exports = {
  schemes
}