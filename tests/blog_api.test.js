const mongoose = require('mongoose')
const helper = require('./blog_api_test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

describe('test methods related to blogs', () => {
  beforeEach( async() => {
    await Blog.deleteMany({})

    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
  })

  describe('retrieve blogs from database', () => {
    test('blogs are returned as json', async () => {
      await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    }, 100000)

    test('all blogs are returned', async() => {
      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('all blogs have a field named id', async() => {
      const response = await api.get('/api/blogs')
      expect(response.body[0].id).toBeDefined()
      expect(response.body[1].id).toBeDefined()
    })
  })

  describe('add new blogs to the database', () => {
    test('a valid blog can be added', async() => {
      const newBlog = {
        title: 'Test 3',
        author: 'Test Author 3',
        url: 'wwww.testblog3.com',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(n => n.title)
      expect(titles).toContain('Test 3')
    })

    test('a note created with out the likes property defaults to having zero likes', async() => {
      const newBlog = {
        title: 'Test 3',
        author: 'Test Author 3',
        url: 'wwww.testblog3.com'
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const blogWithoutLikes =  blogsAtEnd.filter(blog => {return blog.title === 'Test 3'})
      expect(blogWithoutLikes[0].likes).toBe(0)
    })

    test('a note created without a title returns status code 400 bad request', async() => {
      const newBlog = {
        author: 'Test Author 3',
        url: 'wwww.testblog3.com',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })

    test('a note created without a url returns status code 400 bad request', async() => {
      const newBlog = {
        title: 'Test 3',
        author: 'Test Author 3',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })
  })

  describe('deleting blogs', () => {
    test('a valid blog can be deleted', async () => {
      const blogsAtStart = await helper.blogsInDb()

      await api
        .delete(`/api/blogs/${blogsAtStart[0].id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
    })

    test('passing an id not associated with a blog in the database causes a 400 error', async () => {
      await api
        .delete('/api/blogs/5')
        .expect(400)
    })
  })

  describe('updating blogs', () => {
    test('a valid update can be made to a blog', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const updatedBlog = {
        title: 'Test 2',
        author: 'Test Author 2',
        url: 'wwww.testblog2.com',
        likes: 15
      }
      await api
        .put(`/api/blogs/${blogsAtStart.filter(blog => {return blog.title === 'Test 2'})[0].id}`)
        .send(updatedBlog)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const blogWithUpdatedLikes =  blogsAtEnd.filter(blog => {return blog.title === 'Test 2'})
      expect(blogWithUpdatedLikes[0].likes).toBe(15)
    })

    test('updating an id not associated with a blog in the database causes a 400 error', async () => {
      const updatedBlog = {
        title: 'Test 2',
        author: 'Test Author 2',
        url: 'wwww.testblog2.com',
        likes: 15
      }

      await api
        .delete('/api/blogs/5')
        .send(updatedBlog)
        .expect(400)
    })
  })
})

describe('test methods related to users', () => {
  beforeEach(async() => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'Joe Bloggs', passwordHash })

    await user.save()
  })

  test('create new user works with a unique username', async() => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Testy',
      name: 'Testy McTestface',
      password: 'supersecurepassword'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('create new user with name already in database returns 400 error code', async() => {
    const newUser = {
      username: 'root',
      name: 'Testy McTestface',
      password: 'supersecurepassword'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('The given username is not unique.')
  })

  test('create new user with password less than three characters in database returns 400 error code', async() => {
    const newUser = {
      username: 'Testy3',
      name: 'Testy McTestface',
      password: 'aa'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('You password must contain at least 3 characters')
  })

  test('create new user with username less than three characters in database returns 400 error code', async() => {
    const newUser = {
      username: '12',
      name: 'Testy McTestface',
      password: 'asfddfshdfh'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('User validation failed: username: Path `username` (`12`) is shorter than the minimum allowed length (3).')
  })

  test('creating a new user without a password retuns 400 error code', async() => {
    const newUser = {
      username: 'Testy4',
      name: 'Testy McTestface'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('You must provide a password to create a new user')
  })

  test('creating a new user without a username retuns 400 error code', async() => {
    const newUser = {
      name: 'Testy McTestface',
      password: 'supersecurepassword'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('User validation failed: username: Path `username` is required.')
  })

})

afterAll(async () => {
  await mongoose.connection.close()
})