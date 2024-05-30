/* eslint-disable no-undef */
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'First Blog Post',
    author: 'Author 1',
    url: 'http://example.com/1',
    likes: 5
  },
  {
    title: 'Second Blog Post',
    author: 'Author 2',
    url: 'http://example.com/2',
    likes: 10
  },
  {
    title: 'Third Blog Post',
    author: 'Author 1',
    url: 'http://example.com/3',
    likes: 15
  }
]

const nonExistingId = async ()=>{
  const blog = new Blog({ title: 'willremovethissoon', author: 'Author', url: 'http://example.com/temp', likes: 0 })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async ()=>{
  const blogs = await Blog.find({})
  return blogs.map(blog=>blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}
