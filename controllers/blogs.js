const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// Get existing blogs
blogsRouter.get('', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

// Create new blog
blogsRouter.post('', async (request, response) => {
  const blog = new Blog(request.body)
  if (!blog.title || !blog.url) {
    response.status(400).end()
  }

  const blogResponse = await blog.save()
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