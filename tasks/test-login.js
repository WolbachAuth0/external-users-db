const axios = require('axios')

testLogin()

async function testLogin () {
  try {
    const config = {
      baseURL: 'http://localhost:5000/api/v1/users',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const body = {
      email: 'aaron.wolbach@okta.com',
      password: 'Auth0Dem0!'
    }
    const http = axios.create(config)
    const response = await http.post('/login', body)
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}
