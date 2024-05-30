const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const Blog = require('../models/blog')
const User = require('../models/user')


beforeEach(async ()=>{
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('When returning blog posts in the database', ()=>{
  test('blogs are returned as JSON and correct amount', async ()=>{
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogs = response.body
    assert.strictEqual(blogs.length, helper.initialBlogs.length)
  })

  test('unique identifier property of the blog posts is named id', async ()=>{
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogs = response.body
    blogs.forEach(blog=>{
      assert.ok(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })
})

after(async ()=>{
  await mongoose.connection.close()
})