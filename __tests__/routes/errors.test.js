const request = require('supertest')
const express = require('express')
const errors = require('./../../server/routes/errors')

const app = new express()
app.use('/', errors)

describe('Error handler endpoints', function () {

  describe('Responds to unhandled api endpoints ...', () => {
    
    let res
    beforeAll(async () => {
      const url = '/api/dude'
      res = await request(app).get(url)
    })

    test('status code is 404', () => {
      expect(res.statusCode).toBe(404)
    })
    test('content-type is application/json', () => {
      expect(res.header['content-type']).toBe('application/json; charset=utf-8')
    })
    test('response data is json', () => {
      expect(res.text).toBeDefined()
      expect(JSON.parse(res.text)).toBeDefined()
    })
  })
  

  describe('Responds to unhandled view endpoints ...', () => {
    let res
    beforeAll(async () => {
      const url = '/dude'
      res = await request(app).get(url)
    })

    test('status code is 404', () => {
      expect(res.statusCode).toBe(404)
    })
    test('content-type is html', () => {
      expect(res.header['content-type']).toBe('text/html; charset=utf-8')
    })
    test('response body should include "Not Found"', () => {
      expect(res.text).toBeDefined()
      expect(res.text.toLowerCase()).toEqual(expect.stringContaining('not found'))
    })
  })

})