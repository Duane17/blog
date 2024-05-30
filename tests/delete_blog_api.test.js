const { test, describe, beforeEach, after } = require('node:test')
const assert = require('assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('password', 10)
  const user = new User({ username: 'testuser', passwordHash })
  await user.save()

  const newBlog = new Blog({
    title: 'First blog',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 5,
    user: user._id
  })
  await newBlog.save()
})

describe('deleting a blog', () => {
  test('succeeds with status code 204 if id is valid and user is the creator', async () => {
    const loginCredentials = { username: 'testuser', password: 'password' }
    const loginResponse = await api.post('/api/login').send(loginCredentials).expect(200)

    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .expect(204)

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  })

  test('fails with status code 401 if token is missing or invalid', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })

  test('fails with status code 403 if user is not the creator', async () => {
    const passwordHash = await bcrypt.hash('otherpassword', 10)
    const otherUser = new User({ username: 'otheruser', passwordHash })
    await otherUser.save()

    const loginCredentials = { username: 'otheruser', password: 'otherpassword' }
    const loginResponse = await api.post('/api/login').send(loginCredentials).expect(200)

    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .expect(403)

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
