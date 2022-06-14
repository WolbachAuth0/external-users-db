const axios = require('axios')


testSignUp()

async function testSignUp () {
  try {
    const config = {
      baseURL: 'http://localhost:5000/api/v1/users',
    } 
    const http = axios.create(config)
    const user = {
      email: 'aaron.wolbach@okta.com',
      password: 'Auth0Dem0!'
    }
    const response = await http.post('/signup', user)
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}
