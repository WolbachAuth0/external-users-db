async function login(email, password, callback) {
  const axios = require('axios');
	
  try {
    const token = await getToken();
    const user = await loginUser(email, password, token)
    
    if (!user) {
      callback()
    }

    const profile = {

    }
  } catch (error) {
		callback(error)
  }
  
  async function loginUser (email, password, token) {
    const http = axios.create({
      baseURL: `https://exernal-users.herokuapp.com/`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    const body = {
      username: email,
      password
    }
    const response = await http.post(`/api/v1/users/login`, body)

    if (response.statusCode !== 200 && response.statusCode !== 401) {
      return null
    }

    return response.data.data
  }
  
  async function getToken () {
    const http = axios.create({
      baseURL: `https://aaron-custom-demos.us.auth0.com`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const body = {
      grant_type: 'client_credentials',
      client_id: configuration.CLIENT_ID,
      client_secret: configuration.CLIENT_SECRET,
      audience: 'https://exernal-users.herokuapp.com/api/v1'
    }

    const response = await http.post(`/oauth/token`, body);
    
    if (response.status < 200 || response.status >= 300) {
      const error = response.data;
      throw new Error(error.statusMessage);
    }
    return response.data;
  }
}