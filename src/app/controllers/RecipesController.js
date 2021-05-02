const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');
const File = require('../models/File');
const RecipeFile = require('../models/RecipeFile');

module.exports = {
  async index(req, res) {
    let results = await Recipe.all();
    const recipes = results.rows;

    if (!recipes) return res.send('Receita não encontrada');

    async function getImage(recipeId) {
      let results = await Recipe.files(recipeId);
      const files = results.rows.map(
        file =>
          `${req.protocol}://${req.headers.host}${file.path.replace(
            'public',
            '',
          )}`,
      );

      return files[0];
    }

    const recipesPromise = recipes.map(async recipe => {
      recipe.img = await getImage(recipe.id);
      return recipe;
    });

    const allRecipes = await Promise.all(recipesPromise);

    return res.render('admin/recipes/index', { recipes: allRecipes });
  },
  async create(req, res) {
    let results = await Chef.all();
    const chefOptions = results.rows;

    return res.render('admin/recipes/create', { chefOptions });
  },
  async post(req, res) {
    const keys = Object.keys(req.body);

    for (value of keys) {
      if (req.body[value] == '') {
        return res.send('Por favor, preencha todos os campos!');
      }
    }

    if (req.files.length == 0) {
      return res.send('Por favor, envie pelo menos 1 foto!');
    }

    let results = await Recipe.create(req.body);
    const recipeId = results.rows[0].id;

    const filesPromise = req.files.map(async file => {
      const results = await File.create(file);
      const file_id = results.rows[0].id;

      const data = {
        file_id,
        recipe_id: recipeId,
      };

      await RecipeFile.create(data);
    });

    await Promise.all(filesPromise);

    return res.redirect(`/admin/recipes/${recipeId}`);
  },
  async show(req, res) {
    let results = await Recipe.find(req.params.id);
    const recipe = results.rows[0];

    if (!recipe) return res.send('Receita não encontrada');

    results = await Recipe.files(recipe.id);
    const files = results.rows.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        'public',
        '',
      )}`,
    }));

    return res.render('admin/recipes/show', { recipe, files });
  },
  async edit(req, res) {
    const { id } = req.params;

    let results = await Chef.all();
    const chefOptions = results.rows;

    results = await Recipe.find(id);
    const recipe = results.rows[0];

    if (!recipe) return res.send('Receita não encontrada!');

    results = await Recipe.files(recipe.id);
    let files = results.rows;
    files = files.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        'public',
        '',
      )}`,
    }));

    return res.render('admin/recipes/edit', {
      recipe,
      chefOptions,
      files,
    });
  },
  async put(req, res) {
    const keys = Object.keys(req.body);

    for (let key of keys) {
      if (req.body[key] == '' && key != 'removed_files') {
        return res.send('Por favor, preencha todos os campos!');
      }
    }

    if (req.files.length != 0) {
      const newFilesPromise = req.files.map(async file => {
        const results = await File.create(file);
        const file_id = results.rows[0].id;

        const data = {
          file_id,
          recipe_id: req.body.id,
        };

        await RecipeFile.create(data);
      });

      await Promise.all(newFilesPromise);
    }

    if (req.body.removed_files) {
      const removedFiles = req.body.removed_files.split(',');
      const lastIndex = removedFiles.length - 1;
      removedFiles.splice(lastIndex, 1);

      const removedFilesPromise = removedFiles.map(id => {
        RecipeFile.delete(id);
        File.delete(id);
      });

      await Promise.all(removedFilesPromise);
    }

    await Recipe.update(req.body);

    return res.redirect(`/admin/recipes/${req.body.id}`);
  },
  async delete(req, res) {
    try {
      const { id } = req.body;
      let results = await Recipe.files(id);
      const files = results.rows;
      const deletedFilesPromise = files.map(file => {
        RecipeFile.delete(file.file_id);
        File.delete(file.file_id);
      });

      await Promise.all(deletedFilesPromise);
      await Recipe.delete(id);

      return res.redirect('/admin/recipes');
    } catch (error) {
      throw new Error(error);
    }
  },
};
