const request = require('supertest')
const express = require('express')
const users = require('./../../server/routes/users')

const app = new express()
app.use('/', users)

describe('User routes', () => {

  describe('GET /login', () => {

  })

  describe('POST /signup', () => {

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