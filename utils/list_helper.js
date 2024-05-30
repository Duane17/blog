/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const _ = require('lodash')

const dummy = (blogs)=>{
  return 1
}

const totalLikes = (blogs)=>{
  return blogs.reduce((sum, blog)=>sum + blog.likes, 0)
}

const favoriteBlog = (blogs)=>{
  if (blogs.length === 0) {
    return null
  }
  return blogs.reduce((favorite, blog)=>{
    return (blog.likes > favorite.likes) ? blog : favorite
  }, blogs[0])
}

const mostBlogs = (blogs)=>{
  if(_.isEmpty(blogs)) {
    return null
  }

  const authorCounts = _.countBy(blogs, 'author')

  const topAuthor = _.maxBy(_.keys(authorCounts), (author)=>authorCounts[author])

  return {
    author: topAuthor,
    blogs: authorCounts[topAuthor]
  }
}

const mostLikes = (blogs)=>{
  if (_.isEmpty(blogs)) {
    return null
  }

  // Calculate total likes for each author
  const likesByAuthor = _.reduce(blogs, (result, blog)=>{
    result[blog.author] = (result[blog.author] || 0) + blog.likes
    return result
  }, {})

  // Find the author with the most likes
  const topAuthor = _.maxBy(_.keys(likesByAuthor), (author)=>likesByAuthor[author])

  return {
    author: topAuthor,
    likes: likesByAuthor[topAuthor]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}