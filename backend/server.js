const express = require('express')
const nunjucks = require('nunjucks')

const recipes = require('./data')

const server = express()

server.use(express.static('../public'))

server.set('view engine', 'njk')

nunjucks.configure('../views', {
  express: server,
  noCache: true
})

server.get('/', (req, res) => {
  res.render('index', { items: recipes })
})

server.get('/about', (req, res) => {
  res.render('about')
})

server.get('/recipes', (req, res) => {
  res.render('recipes', { items: recipes })
})

server.get('/recipes/:index', (req, res) => {
  const recipeIndex = req.params.index
  const recipe = [...recipes]

  //console.log(recipeIndex)
  //console.log(recipe)
  console.log(recipe[recipeIndex])
  res.render('recipe', { recipe: recipe[recipeIndex] })
})

server.listen(3000, () => {
  console.log('Server is running')
})