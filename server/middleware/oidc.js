const { auth, requiresAuth } = require('express-openid-connect')

const oidcMiddleware = auth({
  authRequired: false,
  auth0Logout: true,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  baseURL: `${process.env.AUTH0_DOMAIN}/`,
  clientID: process.env.AUTH0_CLIENT_ID,
  secret: process.env.AUTH0_API_CLIENT_SECRET,
  idpLogout: true,
})

module.exports = oidcMiddleware