const Chef = require('../models/Chef');
const File = require('../models/File');

const { getImages } = require('../../lib/utils');

const loadService = {
  load(service, filter) {
    this.filter = filter;
    return this[service]();
  },
  async chef() {
    try {
      const chef = await Chef.find(this.filter);

      chef.file = await File.findOne({ where: { id: chef.file_id } });
      chef.file.src = `${chef.file.path.replace('public', '')}`;

      const recipes = await Chef.chefRecipes(chef.id);
      const recipesPromise = recipes.map(async recipe => {
        const files = await getImages(recipe.id);
        recipe.img = files[0].src;
        return recipe;
      });

      chef.recipes = await Promise.all(recipesPromise);

      return chef;
    } catch (error) {
      throw new Error(error);
    }
  },
  async chefs() {
    try {
      const chefs = await Chef.all();
      const chefsPromise = chefs.map(async chef => {
        const file = await File.findOne({ where: { id: chef.file_id } });
        chef.avatar = `${file.path.replace('public', '')}`;
        return chef;
      });

      const allChefs = await Promise.all(chefsPromise);
      return allChefs;
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = loadService;
