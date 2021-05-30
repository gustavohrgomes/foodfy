const { unlinkSync } = require('fs');

const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');
const File = require('../models/File');
const RecipeFile = require('../models/RecipeFile');

const LoadRecipeService = require('../services/LoadRecipeService');

module.exports = {
  async index(req, res) {
    try {
      const recipes = await LoadRecipeService.load('recipes');
      return res.render('admin/recipes/index', { recipes });
    } catch (error) {
      throw new Error(error);
    }
  },
  async create(req, res) {
    try {
      const chefOptions = await Chef.all();
      return res.render('admin/recipes/create', { chefOptions });
    } catch (error) {
      console.log(error);
    }
  },
  async post(req, res) {
    try {
      const {
        chef: chef_id,
        title,
        ingredients,
        preparation,
        information,
      } = req.body;

      const recipe_id = await Recipe.create({
        chef_id,
        user_id: req.session.userId,
        title,
        ingredients,
        preparation,
        information,
      });

      const filesPromise = req.files.map(async file => {
        const file_id = await File.create({
          name: file.filename,
          path: file.path,
        });

        await RecipeFile.create({
          file_id,
          recipe_id,
        });
      });

      await Promise.all(filesPromise);

      return res.redirect(`/admin/recipes/${recipe_id}`);
    } catch (error) {
      throw new Error(error);
    }
  },
  async show(req, res) {
    try {
      const recipe = await LoadRecipeService.load('recipe', req.params.id);
      if (!recipe) return res.send('Receita não encontrada!');
      return res.render('admin/recipes/show', { recipe });
    } catch (error) {
      throw new Error(error);
    }
  },
  async edit(req, res) {
    try {
      const recipe = await LoadRecipeService.load('recipe', req.params.id);
      if (!recipe) return res.send('Receita não encontrada!');
      const chefOptions = await Chef.all();
      return res.render('admin/recipes/edit', {
        recipe,
        chefOptions,
      });
    } catch (error) {
      throw new Error(error);
    }
  },
  async put(req, res) {
    try {
      let {
        id,
        removed_files,
        chef: chef_id,
        title,
        ingredients,
        preparation,
        information,
      } = req.body;

      if (req.files.length != 0) {
        const newFilesPromise = req.files.map(async file => {
          const file_id = await File.create({
            name: file.filename,
            path: file.path,
          });

          await RecipeFile.create({
            file_id,
            recipe_id: id,
          });
        });

        await Promise.all(newFilesPromise);
      }

      if (removed_files) {
        removed_files = req.body.removed_files.split(',');
        const lastIndex = removed_files.length - 1;
        removed_files.splice(lastIndex, 1);

        const removedFilesPromise = removed_files.map(async id => {
          RecipeFile.delete({ file_id: id });

          const file = await File.findOne({ where: { id } });
          File.delete({ id });
          unlinkSync(file.path);
        });

        await Promise.all(removedFilesPromise);
      }

      await Recipe.update(id, {
        title,
        chef_id,
        ingredients,
        preparation,
        information,
      });

      return res.redirect(`/admin/recipes/${req.body.id}`);
    } catch (error) {
      throw new Error(error);
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.body;
      const files = await Recipe.files(id);
      const deletedFilesPromise = files.map(file => {
        RecipeFile.delete({ file_id: file.file_id });
        File.delete({ id: file.file_id });
        try {
          unlinkSync(file.path);
        } catch (error) {
          throw new Error(error);
        }
      });

      await Promise.all(deletedFilesPromise);
      await Recipe.delete({ id });

      return res.redirect('/admin/recipes');
    } catch (error) {
      throw new Error(error);
    }
  },
};
