const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');

module.exports = {
  async index(req, res) {
    try {
      const recipes = await Recipe.all();

      async function getImage(recipeId) {
        let files = await Recipe.files(recipeId);
        files = files.map(
          file =>
            `${req.protocol}://${req.headers.host}${file.path.replace(
              'public',
              '',
            )}`,
        );

        return files[0];
      }

      const recipesPromise = recipes
        .map(async recipe => {
          recipe.img = await getImage(recipe.id);

          return recipe;
        })
        .filter((recipe, index) => (index > 5 ? false : true));

      await Promise.all(recipesPromise);

      return res.render('home/index', { recipes });
    } catch (error) {
      throw new Error(error);
    }
  },
  about(req, res) {
    return res.render('home/about');
  },
  async recipes(req, res) {
    try {
      let { filter, page, limit } = req.query;

      page = page || 1;
      limit = limit || 6;

      let offset = limit * (page - 1);

      const queryParams = {
        filter,
        limit,
        offset,
      };

      const recipes = await Recipe.recipes(queryParams);

      if (!recipes) return res.send('Receita não encontrada!');

      async function getImage(recipeId) {
        let files = await Recipe.files(recipeId);
        files = files.map(
          file =>
            `${req.protocol}://${req.headers.host}${file.path.replace(
              'public',
              '',
            )}`,
        );

        return files[0];
      }

      const recipesPromise = recipes
        .map(async recipe => {
          recipe.img = await getImage(recipe.id);

          return recipe;
        })
        .filter((recipe, index) => (index > 5 ? false : true));

      await Promise.all(recipesPromise);

      const pagination = {};

      if (recipes.length == 0) {
        pagination.total = 1;
        pagination.page = page;
      } else {
        pagination.total = Math.ceil(recipes[0].total / limit);
        pagination.page = page;
      }

      if (filter) {
        return res.render('search/index', {
          recipes,
          pagination,
          filter,
        });
      }

      return res.render('home/recipes', {
        recipes,
        pagination,
      });
    } catch (error) {
      throw new Error(error);
    }
  },
  async show(req, res) {
    try {
      const recipe = await Recipe.find(req.params.id);

      let files = await Recipe.files(recipe.id);
      files = files.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace(
          'public',
          '',
        )}`,
      }));

      return res.render('home/recipe', { recipe, files });
    } catch (error) {
      throw new Error(error);
    }
  },
  async chefs(req, res) {
    const chefs = await Chef.all();

    async function getImage(fileId) {
      const file = await Chef.file(fileId);

      return `${req.protocol}://${req.headers.host}${file.path.replace(
        'public',
        '',
      )}`;
    }

    const chefsPromise = chefs.map(async chef => {
      chef.avatar = await getImage(chef.file_id);
      return chef;
    });

    const allChefs = await Promise.all(chefsPromise);

    return res.render('home/chefs', { chefs: allChefs });
  },
};
