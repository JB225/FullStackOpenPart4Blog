const logger = require('./logger')
const jwt = require('jsonwebtoken')
const config = require('./config')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path: ', request.path)
  logger.info('Body: ', request.body)
  logger.info('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'MongoServerError' && error.code === 11000) {
    return response.status(400).json({ error: 'The given username is not unique.' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer')) {
    request.token = authorization.replace('Bearer ', '')
  }

  next()
}

const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer')) {
    const decodedToken = jwt.verify(authorization.replace('Bearer ', ''), config.SECRET)
    request.user = await User.findById(decodedToken.id)
  }
  next()
}

module.exports = {
  requestLogger,
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
  userExtractor
}