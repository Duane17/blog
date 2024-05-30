const { test, describe, beforeEach, after } = require('node:test')
const assert = require('assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')
const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('password', 10)
  const user = new User({ username: 'testuser', passwordHash })

  await user.save()
})

describe('when there is initially one user in db', () => {
  test('login succeeds with correct credentials', async () => {
    const loginCredentials = {
      username: 'testuser',
      password: 'password',
    }

    const result = await api
      .post('/api/login')
      .send(loginCredentials)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert(result.body.token)
    assert.strictEqual(result.body.username, 'testuser')
  })

  test('login fails with incorrect credentials', async () => {
    const loginCredentials = {
      username: 'testuser',
      password: 'wrongpassword',
    }

    const result = await api
      .post('/api/login')
      .send(loginCredentials)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(!result.body.token)
    assert.strictEqual(result.body.error, 'invalid username or password')
  })
})

after(async () => {
  await mongoose.connection.close()
})
