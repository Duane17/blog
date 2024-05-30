/* eslint-disable no-undef */
const { test, describe } = require('node:test')
const assert = require('node:assert')

const totalLikes = require('../utils/list_helper').totalLikes

describe('totalLikes', ()=>{
  test('when list has no blogs, equals 0', ()=>{
    const blogs = []
    const result = totalLikes(blogs)
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog, equals the likes of that blog', ()=>{
    const blogs = [
      { title: 'Blog 1', author: 'Author 1', url: 'http://example.com/1', likes: 5 }
    ]
    const result = totalLikes(blogs)
    assert.strictEqual(result, 5)
  })

  test('when list has multiple blogs, equals the sum of likes', ()=>{
    const blogs = [
      { title: 'Blog 1', author: 'Author 1', url: 'http://example.com/1', likes: 5 },
      { title: 'Blog 2', author: 'Author 2', url: 'http://example.com/2', likes: 10 },
      { title: 'Blog 3', author: 'Author 3', url: 'http://example.com/3', likes: 15 }
    ]
    const result = totalLikes(blogs)
    assert.strictEqual(result, 30)
  })
})
