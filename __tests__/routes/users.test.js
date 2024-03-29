const request = require('supertest')
const express = require('express')
const getToken = require('./../../auth0-db-actions/getToken')

// import modules
const Service = require('./../../server/services/users')
const Controller = require('./../../server/library/Controller')

// define sample data
const baseURL = '/api/v1/users'
const sampleUser = {
  id: '6292f59dd0c80fb7f68db6a1',
  email: 'aaron.wolbach@okta.com',
  verified: false,
  profile: {},
  createdAt: '2022-05-29T04:25:01.421Z',
  updatedAt: '2022-05-29T04:25:01.421Z'
}

const samplePaginate = {
  docs: [ sampleUser ],
  totalDocs: 1,
  limit: 50,
  totalPages: 1,
  page: 1,
  pagingCounter: 1,
  hasPrevPage: false,
  hasNextPage: false,
  prevPage: null,
  nextPage: null
}

// spin up express
const app = new express()
app.use(express.json())

// Define test suite
describe('User routes', () => {
  let controllerSpy = {
    validateRequestBody: jest.fn(),
    decodeBasicAuth: jest.fn()
  }
  
  beforeAll(async () => {
    // mock Controller methods before loading users router
    controllerSpy.validateRequestBody = jest.fn((req, res, next) => { next() })
    controllerSpy.decodeBasicAuth = jest.spyOn(Controller, 'decodeBasicAuth')

    jest.spyOn(Controller.prototype, 'validateRequestBody')
      .mockImplementation(schema => controllerSpy.validateRequestBody)

    const users = require('./../../server/routes/users')
    app.use(baseURL, users)
    var { access_token } = await getToken()
    // console.log(access_token)
  })

  describe('GET /login', () => {
    const resolved = { status: 200, data: sampleUser }
    let loginSpy = jest.spyOn(Service, 'login')
      .mockImplementation(() => Promise.resolve(resolved))
    
    const url = `${baseURL}/login`
    const auth = { email: 'aaron.wolbach@okta.com', password: 'Auth0Dem0!' }
    let response
    
    describe('happy path ...', () => {
      beforeAll(async () => {
        response = await request(app)
          .post(url)
          .send(auth)
          .set('Authorization', `Bearer ${access_token}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
      })
      afterAll(() => {
        jest.clearAllMocks()
        loginSpy.mockReset()
      })
  
      it('should call the controller\'s validateRequestBody method', () => {
        expect(controllerSpy.validateRequestBody).toHaveBeenCalled()
      })
      it('responds with status code 200', () => {
        expect(response.statusCode).toBe(resolved.status)
      })
      it('response header content-type is application/json', () => {
        expect(response.header['content-type']).toBe('application/json; charset=utf-8')
      })
      it('responds with properly formatted data', () => {
        const body = JSON.parse(response.text)
        const expectedResponse = {
          success: true,
          data: expect.objectContaining(resolved.data)
        }
        expect(response.text).toBeDefined()
        expect(body).toBeDefined()
        expect(body).toMatchObject(expectedResponse)
      })
      it('should call the user service\'s static login method', () => {
        expect(loginSpy).toHaveBeenCalled()
      })
      it('passes email and password to the user service\'s login method', () => {
        expect(loginSpy).toHaveBeenCalledWith(auth.email, auth.password)
      })
    })
    
    describe('if the user service\'s login method throws an error ...', () => {
      beforeAll(async () => {
        loginSpy = jest.spyOn(Service, 'login')
          .mockImplementation(() => { throw new Error('test error') })

        response = await request(app)
          .post(url)
          .send(auth)
          .set('Authorization', `Bearer ${access_token}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
      })
      afterAll(() => {
        loginSpy = jest.spyOn(Service, 'login')
          .mockImplementation(() => Promise.resolve(resolved))
        jest.clearAllMocks()
      })

      it('should return a 401 error', () => {
        expect(response.statusCode).toBe(401)
      })
    })

    describe('if no authorization header was sent with the request ...', () => {
      beforeAll(async () => {
        response = await request(app)
          .post(url)
          .send(auth)
          .set('Authorization', `Bearer ${access_token}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')

      })
      afterAll(() => {
        jest.clearAllMocks()
      })

      it.todo('should return a 401 error')
    })
  })

  describe('POST /signup', () => {
    const resolved = { status: 201, data: sampleUser }
    const signupSpy = jest.spyOn(Service, 'signup')
      .mockImplementation(() => Promise.resolve(resolved))

    const url = `${baseURL}/signup`
    const requestBody = {
      email: sampleUser.email,
      password: 'password123'
    }
    let response
    beforeAll(async () => {
      response = await request(app)
        .post(url)
        .send(requestBody)
        .set('Authorization', `Bearer ${access_token}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
    })
    afterAll(() => {
      jest.clearAllMocks()
      signupSpy.mockReset()
    })

    it('should call the controller\'s validateRequestBody method', () => {
      expect(controllerSpy.validateRequestBody).toHaveBeenCalled()
    })
    it('responds with status code 201', () => {
      expect(response.statusCode).toBe(resolved.status)
    })
    it('response header content-type is application/json', () => {
      expect(response.header['content-type']).toBe('application/json; charset=utf-8')
    })
    it('responds with properly formatted data', () => {
      const body = JSON.parse(response.text)
      const expectedResponse = {
        success: true,
        data: expect.objectContaining(resolved.data)
      }
      expect(response.text).toBeDefined()
      expect(body).toBeDefined()
      expect(body).toMatchObject(expectedResponse)
    })
    it('should call the user service\'s static signup method', () => {
      expect(signupSpy).toHaveBeenCalled()
    })
    it('passes email and password to the user service\'s signup method', () => {
      expect(signupSpy).toHaveBeenCalledWith(requestBody.email, requestBody.password)
    })
  })

  describe('PUT /verify', () => {
    const resolved = { status: 200, data: sampleUser }
    const verifySpy = jest.spyOn(Service, 'verify')
      .mockImplementation(() => Promise.resolve(resolved))

    const url = `${baseURL}/verify`
    let response
    const requestBody = { email: sampleUser.email }
    beforeAll(async () => {
      response = await request(app)
        .put(url)
        .send(requestBody)
        .set('Authorization', `Bearer ${access_token}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
    })
    afterAll(() => {
      jest.clearAllMocks()
      verifySpy.mockReset()
    })

    it('should call the controller\'s validateRequestBody method', () => {
      expect(controllerSpy.validateRequestBody).toHaveBeenCalled()
    })
    it('responds with status code 200', () => {
      expect(response.statusCode).toBe(resolved.status)
    })
    it('response header content-type is application/json', () => {
      expect(response.header['content-type']).toBe('application/json; charset=utf-8')
    })
    it('responds with properly formatted data', () => {
      const body = JSON.parse(response.text)
      const expectedResponse = {
        success: true,
        data: expect.objectContaining(resolved.data)
      }
      expect(response.text).toBeDefined()
      expect(body).toBeDefined()
      expect(body).toMatchObject(expectedResponse)
    })
    it('should call the user service\'s static verify method', () => {
      expect(verifySpy).toHaveBeenCalled()
    })
    it('passes email to the user service\'s verify method', () => {
      expect(verifySpy).toHaveBeenCalledWith(requestBody.email)
    })
  })

  describe('PUT /change-password', () => {
    const resolved = { status: 200, data: sampleUser }
    const changePasswordSpy = jest.spyOn(Service, 'changePassword')
      .mockImplementation(() => Promise.resolve(resolved))
    
    const url = `${baseURL}/change-password`
    let response
    const requestBody = {
      email: sampleUser.email,
      newPassword: 'this-isMyp@assword'
    }
    beforeAll(async () => {
      response = await request(app)
        .put(url)
        .send(requestBody)
        .set('Authorization', `Bearer ${access_token}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
    })
    afterAll(() => {
      jest.clearAllMocks()
      changePasswordSpy.mockReset()
    })

    it('should call the controller\'s validateRequestBody method', () => {
      expect(controllerSpy.validateRequestBody).toHaveBeenCalled()
    })
    it('should validate the request body', () => {
      expect(controllerSpy.validateRequestBody).toHaveBeenCalled()
    })
    it('responds with status code 200', () => {
      expect(response.statusCode).toBe(resolved.status)
    })
    it('response header content-type is application/json', () => {
      expect(response.header['content-type']).toBe('application/json; charset=utf-8')
    })
    it('responds with properly formatted data', () => {
      const body = JSON.parse(response.text)
      const expectedResponse = {
        success: true,
        data: expect.objectContaining(resolved.data)
      }
      expect(response.text).toBeDefined()
      expect(body).toBeDefined()
      expect(body).toMatchObject(expectedResponse)
    })
    it('should call the user service\'s static changePassword method', () => {
      expect(changePasswordSpy).toHaveBeenCalled()
    })
    it('passes email to the user service\'s changePassword method', () => {
      expect(changePasswordSpy).toHaveBeenCalledWith(requestBody.email, requestBody.newPassword)
    })
  })

  describe('GET /search', () => {
    const resolved = { status: 200, data: samplePaginate }
    const searchSpy = jest.spyOn(Service, 'search')
      .mockImplementation(() => Promise.resolve(resolved))
    
    const query = {
      email: '\"okta.com\"'
    }
    let url = `${baseURL}/search?email="okta.com"`
    let response
    beforeAll(async () => {
      response = await request(app)
        .get(url)
        .set('Authorization', `Bearer ${access_token}`)
        .set('Accept', 'application/json')
    })
    afterAll(() => {
      jest.clearAllMocks()
      searchSpy.mockReset()
    })

    it('responds with status code 200', () => {
      expect(response.statusCode).toBe(resolved.status)
    })
    it('response header content-type is application/json', () => {
      expect(response.header['content-type']).toBe('application/json; charset=utf-8')
    })
    it('responds with properly formatted data', () => {
      const body = JSON.parse(response.text)
      const expectedResponse = {
        success: true,
        data: expect.objectContaining(resolved.data)
      }
      expect(response.text).toBeDefined()
      expect(body).toBeDefined()
      expect(body).toMatchObject(expectedResponse)
    })
    it('should call the user service\'s static search method', () => {
      expect(searchSpy).toHaveBeenCalled()
    })
    it('passes the query parameters to the search method', () => {
      expect(searchSpy).toHaveBeenCalledWith(query)
    })
  })

  describe('GET /:id', () => {
    const resolved = { status: 200, data: sampleUser }
    const findSpy = jest.spyOn(Service, 'findById')
      .mockImplementation(() => Promise.resolve(resolved))

    const url = `${baseURL}/${sampleUser.id}`
    let response
    beforeAll(async () => {
      response = await request(app)
        .get(url)
        .set('Authorization', `Bearer ${access_token}`)
        .set('Accept', 'application/json')
    })
    afterAll(() => {
      jest.clearAllMocks()
      findSpy.mockReset()
    })

    it('responds with status code 200', () => {
      expect(response.statusCode).toBe(resolved.status)
    })
    it('response header content-type is application/json', () => {
      expect(response.header['content-type']).toBe('application/json; charset=utf-8')
    })
    it('responds with properly formatted data', () => {
      const body = JSON.parse(response.text)
      const expectedResponse = {
        success: true,
        data: expect.objectContaining(resolved.data)
      }
      expect(response.text).toBeDefined()
      expect(body).toBeDefined()
      expect(body).toMatchObject(expectedResponse)
    })
    it('should call the user service\'s static findById method', () => {
      expect(findSpy).toHaveBeenCalled()
    })
    it('should pass the id parameter to the user service\'s findById method', () => {
      expect(findSpy).toHaveBeenCalledWith(sampleUser.id)
    })
  })

  describe('PUT /:id', () => {
    const resolved = { status: 200, data: sampleUser }
    const updateSpy = jest.spyOn(Service, 'update')
      .mockImplementation(() => Promise.resolve(resolved))

    const url = `${baseURL}/${sampleUser.id}`
    const requestBody = {
      email: sampleUser.email,
      verified: true,
      password: 'password',
      profile: {
        first: 'Aaron',
        last: 'Wolbach'
      }
    }
    let response
    beforeAll(async () => {
      response = await request(app)
        .put(url)
        .send(requestBody)
        .set('Authorization', `Bearer ${access_token}`)
        .set('Accept', 'application/json')
    })
    afterAll(() => {
      jest.clearAllMocks()
      updateSpy.mockReset()
    })

    it('should call the controller\'s validateRequestBody method', () => {
      expect(controllerSpy.validateRequestBody).toHaveBeenCalled()
    })
    it('responds with status code 200', () => {
      expect(response.statusCode).toBe(resolved.status)
    })
    it('response header content-type is application/json', () => {
      expect(response.header['content-type']).toBe('application/json; charset=utf-8')
    })
    it('responds with properly formatted data', () => {
      const body = JSON.parse(response.text)
      const expectedResponse = {
        success: true,
        data: expect.objectContaining(resolved.data)
      }
      expect(response.text).toBeDefined()
      expect(body).toBeDefined()
      expect(body).toMatchObject(expectedResponse)
    })
    it('should call the user service\'s static update method', () => {
      expect(updateSpy).toHaveBeenCalled()
    })
    it('should pass the id parameter to the user service\'s update method', () => {
      expect(updateSpy).toHaveBeenCalledWith(requestBody, sampleUser.id)
    })
  })

  describe('DELETE /:id', () => {
    const resolved = {
      status: 200,
      data: {
        id: sampleUser.id,
        deletedAt: '2022-06-15T19:42:20.979Z'
      }
    }
    const removeSpy = jest.spyOn(Service, 'remove')
      .mockImplementation(() => Promise.resolve(resolved))

      const url = `${baseURL}/${sampleUser.id}`
      let response
      beforeAll(async () => {
        response = await request(app)
          .delete(url)
          .set('Authorization', `Bearer ${access_token}`)
          .set('Accept', 'application/json')
      })
      afterAll(() => {
        jest.clearAllMocks()
        removeSpy.mockReset()
      })
  
      it('responds with status code 200', () => {
        expect(response.statusCode).toBe(resolved.status)
      })
      it('response header content-type is application/json', () => {
        expect(response.header['content-type']).toBe('application/json; charset=utf-8')
      })
      it('responds with properly formatted data', () => {
        const body = JSON.parse(response.text)
        const expectedResponse = {
          success: true,
          data: expect.objectContaining(resolved.data)
        }
        expect(response.text).toBeDefined()
        expect(body).toBeDefined()
        expect(body).toMatchObject(expectedResponse)
      })
      it('should call the user service\'s static remove method', () => {
        expect(removeSpy).toHaveBeenCalled()
      })
      it('should pass the id parameter to the user service\'s remove method', () => {
        expect(removeSpy).toHaveBeenCalledWith(sampleUser.id)
      })
  })
})
