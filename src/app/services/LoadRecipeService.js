const Recipe = require('../models/Recipe');

const { getImages } = require('../../lib/utils');

const loadService = {
  load(service, filter) {
    this.filter = filter;
    return this[service]();
  },
  async recipe() {
    try {
      const recipe = await Recipe.find(this.filter);
      recipe.files = await getImages(recipe.id);
      return recipe;
    } catch (error) {
      throw new Error(error);
    }
  },
  async recipes() {
    try {
      const recipes = await Recipe.all();

      const recipesPromise = recipes.map(async recipe => {
        const files = await getImages(recipe.id);

        recipe.img = files[0].src;
        return recipe;
      });

      const allRecipes = Promise.all(recipesPromise);
      return allRecipes;
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = loadService;
