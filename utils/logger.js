const config = require('./config')

const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  if (!config.TEST_MODE) {
    console.error(...params)
  }
}

module.exports = {
  info, error
}