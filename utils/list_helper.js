const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favouriteBlog = (blogs) => {
  if (!blogs === undefined || !blogs.length == 0) {
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

// TODO: Fix this
const mostBlogs11 = (blogs) => {
  let authors = {}
  for (let i = 0; i < blogs.length; i++) {
    if (!Object.keys(authors).includes(blogs[i].author)) {
      authors[blogs[i].author] = 1
    } else {
      authors[blogs[i].author] += 1
    }
  }
  return authors
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog
}