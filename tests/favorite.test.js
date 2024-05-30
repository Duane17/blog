/* eslint-disable no-undef */
const { test, describe } = require('node:test')
const assert = require('node:assert')

const favoriteBlog = require('../utils/list_helper').favoriteBlog

describe('favoriteBlog', ()=>{
  test('when list has no blogs, equals null', ()=>{
    const blogs = []
    const result = favoriteBlog(blogs)
    assert.strictEqual(result, null)
  })

  test('when list has only one blog, equals that blog', ()=>{
    const blogs = [
      { title: 'Blog 1', author: 'Author 1', url: 'http://example.com/1', likes: 5 }
    ]
    const result = favoriteBlog(blogs)
    assert.deepStrictEqual(result, blogs[0])
  })

  test('when list has multiple blogs, equals the one with most likes', ()=>{
    const blogs = [
      { title: 'Blog 1', author: 'Author 1', url: 'http://example.com/1', likes: 5 },
      { title: 'Blog 2', author: 'Author 2', url: 'http://example.com/2', likes: 10 },
      { title: 'Blog 3', author: 'Author 3', url: 'http://example.com/3', likes: 15 }
    ]
    const result = favoriteBlog(blogs)
    assert.deepStrictEqual(result, blogs[2])
  })
})
