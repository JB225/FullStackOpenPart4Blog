const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// Get existing blogs
blogsRouter.get('', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

// Create new blog
blogsRouter.post('', async (request, response) => {
  const body = request.body

  if (!body.title || !body.url) {
    response.status(400).end()
  }

  const blog = new Blog(request.body)
  const user = await User.findById(body.user)
  blog.user = user.id

  const blogResponse = await blog.save()
  user.blogs = user.blogs.concat(blogResponse._id)
  await user.save()
  response.status(201).json(blogResponse)
})

// Delete blog
blogsRouter.delete('/:id', async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (error) {
    response.status(400).end()
  }
})

// Update existing blog
blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body
  const updated = await Blog.findByIdAndUpdate(request.params.id, { title, author, url, likes })
  if (updated) {
    response.status(204).end()
  } else {
    response.status(400).end()
  }
})

module.exports = blogsRouter