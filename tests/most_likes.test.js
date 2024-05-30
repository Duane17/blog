/* eslint-disable no-undef */
const { test, describe } = require('node:test')
const assert = require('node:assert')

const mostLikes = require('../utils/list_helper').mostLikes

describe('mostLikes', ()=>{
  test('when list has no blogs, equals null', ()=>{
    const blogs = []
    const result = mostLikes(blogs)
    assert.strictEqual(result, null)
  })

  test('when list has one blog, equals that author with likes of that blog', ()=>{
    const blogs = [
      { title: 'Blog 1', author: 'Author 1', url: 'http://example.com/1', likes: 5 }
    ]
    const result = mostLikes(blogs)
    assert.deepStrictEqual(result, { author: 'Author 1', likes: 5 })
  })

  test('when list has multiple blogs, equals the author with most likes', ()=>{
    const blogs = [
      { title: 'Blog 1', author: 'Author 1', url: 'http://example.com/1', likes: 5 },
      { title: 'Blog 2', author: 'Author 2', url: 'http://example.com/2', likes: 10 },
      { title: 'Blog 3', author: 'Author 1', url: 'http://example.com/3', likes: 15 },
      { title: 'Blog 4', author: 'Author 3', url: 'http://example.com/4', likes: 7 },
      { title: 'Blog 5', author: 'Author 1', url: 'http://example.com/5', likes: 12 }
    ]
    const result = mostLikes(blogs)
    assert.deepStrictEqual(result, { author: 'Author 1', likes: 32 })
  })
})
