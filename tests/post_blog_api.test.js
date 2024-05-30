const { test, describe, beforeEach, after } = require('node:test')
const assert = require('assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('password', 10)
  const user = new User({ username: 'testuser', passwordHash })
  await user.save()

  await Blog.insertMany(helper.initialBlogs)
})

describe('When adding posts into the database', () => {
  test('a valid blog can be added', async () => {
    const loginCredentials = { username: 'testuser', password: 'password' }
    const loginResponse = await api.post('/api/login').send(loginCredentials).expect(200)

    const newBlog = {
      title: 'New Blog post',
      author: 'Author 3',
      url: 'http://example.com/new',
      likes: 88
    }

    const initialBlogs = await helper.blogsInDb()

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)  // Add this line
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes('New Blog post'))
  })

  test('if likes are missing, it will default to 0', async () => {
    const loginCredentials = { username: 'testuser', password: 'password' }
    const loginResponse = await api.post('/api/login').send(loginCredentials).expect(200)

    const newBlog = {
      title: 'Blog with no likes',
      author: 'Author 4',
      url: 'http://example.com/nolikes'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)  // Add this line
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const addedBlog = blogsAtEnd.find(b => b.title === 'Blog with no likes')

    assert.strictEqual(addedBlog.likes, 0)
  })

  test('blog without title is not added', async () => {
    const loginCredentials = { username: 'testuser', password: 'password' }
    const loginResponse = await api.post('/api/login').send(loginCredentials).expect(200)

    const newBlog = {
      author: 'Author 4',
      url: 'http://example.com/notitle',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)  // Add this line
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('blog without url is not added', async () => {
    const loginCredentials = { username: 'testuser', password: 'password' }
    const loginResponse = await api.post('/api/login').send(loginCredentials).expect(200)

    const newBlog = {
      title: 'Blog without URL',
      author: 'Author 4',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)  // Add this line
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
