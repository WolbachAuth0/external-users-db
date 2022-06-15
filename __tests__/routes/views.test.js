const request = require('supertest')
const express = require('express')
const views = require('./../../server/routes/views')

const app = new express()
app.use('/', views)

describe('View endpoints', function () {

  test('responds to /', async () => {
    const res = await request(app).get('/')
    expect(res.header['content-type']).toBe('text/html; charset=UTF-8')
    expect(res.statusCode).toBe(200)
    expect(res.text).toBeDefined()
  })

})