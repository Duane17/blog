/* eslint-disable no-undef */
const { test, describe } = require('node:test')
const assert = require('node:assert')

const mostBlogs = require('../utils/list_helper').mostBlogs

describe('mostBlogs', ()=>{
  test('when list has no blogs, equals null', ()=>{
    const blogs = []
    const result = mostBlogs(blogs)
    assert.strictEqual(result, null)
  })

  test('when list has one blog, equals that author with one blog', ()=>{
    const blogs = [
      { title: 'Blog 1', author: 'Author 1', url: 'http://example.com/1', likes: 5 }
    ]
    const result = mostBlogs(blogs)
    assert.deepStrictEqual(result, { author: 'Author 1', blogs: 1 })
  })

  test('when list has multiple blogs, equals the author with most blogs', ()=>{
    const blogs = [
      { title: 'Blog 1', author: 'Author 1', url: 'http://example.com/1', likes: 5 },
      { title: 'Blog 2', author: 'Author 2', url: 'http://example.com/2', likes: 10 },
      { title: 'Blog 3', author: 'Author 1', url: 'http://example.com/3', likes: 15 },
      { title: 'Blog 4', author: 'Author 3', url: 'http://example.com/4', likes: 7 },
      { title: 'Blog 5', author: 'Author 1', url: 'http://example.com/5', likes: 12 }
    ]
    const result = mostBlogs(blogs)
    assert.deepStrictEqual(result, { author: 'Author 1', blogs: 3 })
  })
})
