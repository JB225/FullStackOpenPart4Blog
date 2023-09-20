/* eslint-disable no-undef */
require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

const TEST_MODE = process.env.NODE_ENV === 'test'

const SECRET = process.env.SECRET

module.exports = {
  MONGODB_URI,
  PORT,
  TEST_MODE,
  SECRET
}