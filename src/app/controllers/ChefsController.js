const { unlinkSync } = require('fs');

const Chef = require('../models/Chef');
const Recipe = require('../models/Recipe');
const File = require('../models/File');

module.exports = {
  async index(req, res) {
    try {
      const chefs = await Chef.all();

      if (!chefs) return res.send('Chef não encontrado!');

      async function getImage(chefId) {
        const file = await Chef.file(chefId);

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

      return res.render('admin/chefs/index', { chefs: allChefs });
    } catch (error) {
      console.log(error);
    }
  },
  create(req, res) {
    return res.render('admin/chefs/create');
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

      const { filename, path } = req.files[0];
      const file_id = await File.create({ name: filename, path });

      const { name } = req.body;
      const chefId = await Chef.create({ name, file_id });

      return res.redirect(`/admin/chefs/${chefId}`);
    } catch (error) {
      console.log(error);
    }
  },
  async show(req, res) {
    try {
      const { id } = req.params;

      const chef = await Chef.find(id);

      if (!chef) return res.send('Chef não encontrado!');

      const file = await Chef.file(chef.file_id);
      chef.file = file;
      chef.file.src = `${req.protocol}://${
        req.headers.host
      }${chef.file.path.replace('public', '')}`;

      const recipes = await Chef.chefRecipes(id);

      async function getImage(recipeId) {
        let file = await Recipe.files(recipeId);

        return `${req.protocol}://${req.headers.host}${file[0].path.replace(
          'public',
          '',
        )}`;
      }

      const recipesPromise = recipes.map(async recipe => {
        recipe.img = await getImage(recipe.id);
        return recipe;
      });

      const allRecipes = await Promise.all(recipesPromise);

      return res.render('admin/chefs/show', { chef, recipes: allRecipes });
    } catch (error) {
      console.log(error);
    }
  },
  async edit(req, res) {
    try {
      const { id } = req.params;

      const chef = await Chef.find(id);

      if (!chef) return res.send('Chef não encontrado!');

      const file = await Chef.file(chef.file_id);
      file.src = `${req.protocol}://${req.headers.host}${file.path.replace(
        'public',
        '',
      )}`;

      return res.render('admin/chefs/edit', { chef, file });
    } catch (error) {
      console.log(error);
    }
  },
  async put(req, res) {
    try {
      const keys = Object.keys(req.body);

      for (key of keys) {
        if (req.body[key] == '' && key != 'removed_files') {
          return res.send('Por favor, preencha todos os campos!');
        }
      }

      if (req.body.removed_files && req.files == 0) {
        return res.send('Por favor, envie pelo menos 1 imagem.');
      }

      let file_id;

      if (req.files.length != 0) {
        const { filename, path } = req.files[0];
        file_id = await File.create({ name: filename, path });
      }

      const { id, name, removed_files } = req.body;

      await Chef.update(id, {
        name,
        file_id: file_id || req.body.file_id,
      });

      if (removed_files) {
        const removedFileId = removed_files.replace(',', '');
        await File.deleteFile(removedFileId);
      }

      return res.redirect(`/admin/chefs/${req.body.id}`);
    } catch (error) {
      console.log(error);
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.body;
      await Chef.delete({ id });

      const file = await File.findOne({ where: { id: req.body.file_id } });
      await File.delete({ id: file.id });
      unlinkSync(file.path);

      res.redirect('/admin/chefs');
    } catch (error) {
      console.log(error);
    }
  },
};
