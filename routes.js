const express = require('express');
const routes = express.Router();
const recipes = require('./data')

routes.get('/', (req, res) => {
  res.render('index', { items: recipes })
});

routes.get('/about', (req, res) => {
  res.render('about')
});

routes.get('/recipes', (req, res) => {
  res.render('recipes', { items: recipes })
});

routes.get('/recipes/:index', (req, res) => {
  const recipeIndex = req.params.index
  const recipe = [...recipes]

  //console.log(recipeIndex)
  //console.log(recipe)
  console.log(recipe[recipeIndex])
  res.render('recipe', { recipe: recipe[recipeIndex] })
});

module.exports = routes;