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


describe('When updating an existing blog post', ()=>{
  test('an existing blog can be updated', async ()=>{
    const initialBlogs = await helper.blogsInDb()
    const blogToUpdate = initialBlogs[0]

    const updatedBlogData = {
      title: 'Updated Blog Title',
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 1
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const updatedBlog = response.body
    assert.strictEqual(updatedBlog.title, updatedBlogData.title)
    assert.strictEqual(updatedBlog.likes, updatedBlogData.likes)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(b=>b.title)
    assert(titles.includes(updatedBlogData.title))
  })

  test('returns 404 if blog does not exist', async ()=>{
    const nonExistingId = await helper.nonExistingId()

    const updatedBlogData = {
      title: 'Non-Existent Blog',
      author: 'Author',
      url: 'http://example.com/nonexistent',
      likes: 0
    }

    await api
      .put(`/api/blogs/${nonExistingId}`)
      .send(updatedBlogData)
      .expect(404)
  })
})


after(async ()=>{
  await mongoose.connection.close()
})