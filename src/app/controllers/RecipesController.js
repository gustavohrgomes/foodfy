const { unlinkSync } = require('fs');

const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');
const File = require('../models/File');
const RecipeFile = require('../models/RecipeFile');

module.exports = {
  async index(req, res) {
    const recipes = await Recipe.all();

    if (!recipes) return res.send('Receita não encontrada');

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

    const recipesPromise = recipes.map(async recipe => {
      recipe.img = await getImage(recipe.id);
      return recipe;
    });

    const allRecipes = await Promise.all(recipesPromise);

    return res.render('admin/recipes/index', { recipes: allRecipes });
  },
  async create(req, res) {
    try {
      const chefOption = await Chef.all();
      return res.render('admin/recipes/create', { chefOptions });
    } catch (error) {
      console.log(error);
    }
  },
  async post(req, res) {
    try {
      const keys = Object.keys(req.body);

      for (value of keys) {
        if (req.body[value] == '') {
          return res.send('Por favor, preencha todos os campos!');
        }
      }

      if (req.files.length == 0) {
        return res.send('Por favor, envie pelo menos 1 foto!');
      }

      req.body.user_id = req.session.userId;

      const recipeId = await Recipe.create(req.body);

      const filesPromise = req.files.map(async file => {
        const file_id = await File.create(file);

        const data = {
          file_id,
          recipe_id: recipeId,
        };

        await RecipeFile.create(data);
      });

      await Promise.all(filesPromise);

      return res.redirect(`/admin/recipes/${recipeId}`);
    } catch (error) {
      console.log(error);
    }
  },
  async show(req, res) {
    try {
      const recipe = await Recipe.find(req.params.id);

      if (!recipe) return res.send('Receita não encontrada');

      let files = await Recipe.files(recipe.id);
      files = files.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace(
          'public',
          '',
        )}`,
      }));

      return res.render('admin/recipes/show', { recipe, files });
    } catch (error) {
      console.log(error);
    }
  },
  async edit(req, res) {
    try {
      const { id } = req.params;

      const chefOptions = await Chef.all();
      const recipe = await Recipe.find(id);

      if (!recipe) return res.send('Receita não encontrada!');

      let files = await Recipe.files(recipe.id);
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
    } catch (error) {
      console.log(error);
    }
  },
  async put(req, res) {
    try {
      const keys = Object.keys(req.body);

      for (let key of keys) {
        if (req.body[key] == '' && key != 'removed_files') {
          return res.send('Por favor, preencha todos os campos!');
        }
      }

      if (req.files.length != 0) {
        const newFilesPromise = req.files.map(async file => {
          const file_id = await File.create(file);

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
    } catch (error) {
      console.log(error);
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.body;
      const files = await Recipe.files(id);
      const deletedFilesPromise = files.map(file => {
        RecipeFile.delete({ file_id: file.file_id });
        File.delete({ id: file.file_id });
        unlinkSync(file.path);
      });

      await Promise.all(deletedFilesPromise);
      await Recipe.delete({ id });

      return res.redirect('/admin/recipes');
    } catch (error) {
      throw new Error(error);
    }
  },
};
