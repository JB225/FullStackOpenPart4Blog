const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

// TODO: Fix this - check the test database is properly initialised and call is being made properly
// It seems to work fine with manual testing
test('blogs are returned as json', async () => {
    await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

afterAll(async () => {
    await mongoose.connection.close()
})