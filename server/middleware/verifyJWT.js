const jwt = require('express-jwt')
const jwks = require('jwks-rsa')   

/**
 * Validates the signature of an Auth0 access token.
 * Requires the following environment variables to be set
 *    AUTH0_DOMAIN
 *    AUTH0_AUDIENCE
 */
const verifyJWT = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
})

module.exports = verifyJWT