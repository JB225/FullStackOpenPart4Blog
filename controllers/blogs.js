const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

// Get existing blogs
blogsRouter.get('', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

// Create new blog
blogsRouter.post('', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, config.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = request.user

  if (!body.title || !body.url) {
    response.status(400).end()
  }

  const blog = new Blog(request.body)
  blog.user = user.id
  const blogResponse = await blog.save()
  await blog.populate('user', { username: 1, name: 1, id: 1 })

  user.blogs = user.blogs.concat(blogResponse._id)
  await user.save()
  response.status(201).json(blogResponse)
})

// Delete blog
blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, config.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  try {
    const blog = await Blog.findById(request.params.id)
    const userid = request.user.id

    if (blog.user.toString() === userid.toString()) {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    } else {
      response.status(400).json({ error:'You do not have permission to delete that blog' })
    }
  } catch (error) {
    response.status(400).end()
  }
})

// Update existing blog
blogsRouter.put('/:id', async (request, response) => {
  try {
    const { user, title, author, url, likes } = request.body
    const updated = await Blog
      .findByIdAndUpdate(request.params.id, { user, title, author, url, likes }, { new: true })
      .populate('user', { username: 1, name: 1, id: 1 })
    if (updated) {
      response.status(201).json(updated)
    } else {
      response.status(400).end()
    }
  } catch (error) {
    response.status(400).end()
  }
})

module.exports = blogsRouter