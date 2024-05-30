/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://duanegadama:${password}@cluster0.4zhouvb.mongodb.net/testBlogApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
  title: 'Title',
  author: 'Author',
  url: 'url',
  likes: 88
})

blog.save().then(result=>{
  console.log('blog saved')
  mongoose.connection.close()
})