const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favouriteBlog = (blogs) => {
  if (!(blogs === undefined) && !(blogs.length === 0)) {
    let max = blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog)
    return {
      title: max.title,
      author: max.author,
      likes: max.likes
    }
  } else {
    return {
      title: '',
      author: '',
      likes: 0
    }
  }
}

const mostBlogs = (blogs) => {
  if (!(blogs === undefined) && !(blogs.length === 0)) {
    let authors = {}
    for (let i = 0; i < blogs.length; i++) {
      if (!Object.keys(authors).includes(blogs[i].author)) {
        authors[blogs[i].author] = 1
      } else {
        authors[blogs[i].author] += 1
      }
    }
    let max = Object.entries(authors).reduce((max, author) => max[1] > author[1] ? max : author)
    return {
      author : max[0],
      blogs : max[1]
    }
  } else {
    return {
      author: '',
      blogs: 0
    }
  }
}

const mostLikes = (blogs) => {
  if (!(blogs === undefined) && !(blogs.length === 0)) {
    let authors = {}
    for (let i = 0; i < blogs.length; i++) {
      if (!Object.keys(authors).includes(blogs[i].author)) {
        authors[blogs[i].author] = blogs[i].likes
      } else {
        authors[blogs[i].author] += blogs[i].likes
      }
    }
    let max = Object.entries(authors).reduce((max, author) => max[1] > author[1] ? max : author)
    return {
      author : max[0],
      likes : max[1]
    }
  } else {
    return {
      author: '',
      likes: 0
    }
  }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}