const axios = require('axios')

module.exports = async function () {
  try {
    const config = {
      baseURL: `https://${process.env.AUTH0_DOMAIN}`,
      headers: {
        'Content-Type': 'application/json'
      }
    } 
    const http = axios.create(config)
    const body = {
      grant_type: 'client_credentials',
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_API_CLIENT_SECRET,
      audience: process.env.AUTH0_AUDIENCE
    }
    const response = await http.post(`/oauth/token`, body)
    return response.data
  } catch (error) {
    console.error(error.message)
  }
}

