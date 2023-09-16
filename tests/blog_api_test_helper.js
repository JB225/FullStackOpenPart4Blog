const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Test 1',
    author: 'Test Author 1',
    url: 'wwww.testblog1.com',
    likes: 10
  },
  {
    title: 'Test 2',
    author: 'Test Author 2',
    url: 'wwww.testblog2.com',
    likes: 15
  }
]

const blogsInDb = async() => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async() => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb, usersInDb
}