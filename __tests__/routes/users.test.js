const request = require('supertest')
const express = require('express')

const Service = require('./../../server/services/users')
const users = require('./../../server/routes/users')

const app = new express()
app.use(express.json())
app.use('/', users)

const sampleUser = {
  id: '6292f59dd0c80fb7f68db6a1',
  email: 'aaron.wolbach@okta.com',
  verified: false,
  profile: {},
  createdAt: '2022-05-29T04:25:01.421Z',
  updatedAt: '2022-05-29T04:25:01.421Z'
}
const password = 'Auth0Dem0!'
const sampleDelete = {
  id: '6292f59dd0c80fb7f68db6a1',
  deletedAt: '2022-06-15T19:42:20.979Z'
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

describe('User routes', () => {
  let spy = {
    login: null,
    signup: null,
    verify: null,
    changePassword: null,
    search: null,
    findById: null,
    update: null,
    remove: null
  }
  beforeAll(() => {
    jest.clearAllMocks()
    spy.login = jest.spyOn(Service, 'login').mockImplementation(() => {
      return Promise.resolve({ status: 200, data: sampleUser })
    })
    spy.signup = jest.spyOn(Service, 'signup').mockImplementation(() => {
      return Promise.resolve({ status: 201, data: sampleUser })
    })
    spy.verify = jest.spyOn(Service, 'verify').mockImplementation(() => {
      return Promise.resolve({ status: 200, data: sampleUser })
    })
    spy.changePassword = jest.spyOn(Service, 'changePassword').mockImplementation(() => {
      return Promise.resolve({ status: 200, data: sampleUser })
    })
    spy.search = jest.spyOn(Service, 'search').mockImplementation(() => {     
      return Promise.resolve({ status: 200, data: samplePaginate })
    })
    spy.findById = jest.spyOn(Service, 'findById').mockImplementation(() => {
      return Promise.resolve({ status: 200, data: sampleUser })
    })
    spy.update = jest.spyOn(Service, 'update').mockImplementation(() => {
      return Promise.resolve({ status: 200, data: sampleUser })
    })
    spy.remove = jest.spyOn(Service, 'remove').mockImplementation(() => {
      return Promise.resolve({ status: 200, data: sampleDelete })
    })
  })

  describe('GET /login ', () => {
    const url = '/login'
    let res
    beforeAll(async () => {
      res = await request(app)
        .get(url)
        .auth(sampleUser.email, password)
        .set('Accept', 'application/json')
    })
    afterAll(() => {
      jest.clearAllMocks()
    })

    test('status code is 200', () => {
      expect(res.statusCode).toBe(200)
    })
    test('content-type is application/json', () => {
      expect(res.header['content-type']).toBe('application/json; charset=utf-8')
    })
    test('response is json', () => {
      const body = JSON.parse(res.text)
      expect(res.text).toBeDefined()
      expect(body).toBeDefined()
    })
    test('response body is formatted', () => {
      const body = JSON.parse(res.text)
      const expectedResponse = {
        success: true,
        data: sampleUser
      }
      expect(body).toMatchObject(expectedResponse)
    })
    test('should call the static login method', () => {
      expect(spy.login).toHaveBeenCalled()
    })
  })

  describe('POST /signup', () => {
    const url = '/signup'
    let res
    beforeAll(async () => {
      res = await request(app)
        .post(url)
        .send({ email: sampleUser.email, password })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
    })
    afterAll(() => {
      jest.clearAllMocks()
    })

    test('status code is 201', () => {
      expect(res.statusCode).toBe(201)
    })
    test('content-type is application/json', () => {
      expect(res.header['content-type']).toBe('application/json; charset=utf-8')
    })
    test('response data is json', () => {
      expect(res.text).toBeDefined()
      expect(JSON.parse(res.text)).toBeDefined()
    })
    test('should call the static signup method', () => {
      expect(spy.signup).toHaveBeenCalled()
    })
  })

  describe('PUT /verify', () => {

  })

  describe('PUT /change-password', () => {

  })

  describe('GET /', () => {

  })

  describe('GET /:id', () => {

  })

  describe('PUT /:id', () => {

  })

  describe('DELETE /:id', () => {

  })
})