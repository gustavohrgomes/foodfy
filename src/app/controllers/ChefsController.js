const Chef = require('../models/Chef');
const Recipe = require('../models/Recipe');
const File = require('../models/File');

module.exports = {
  async index(req, res) {
    let results = await Chef.all();
    const chefs = results.rows;

    if (!chefs) return res.send('Chef não encontrado!');

    async function getImage(chefId) {
      let results = await Chef.file(chefId);
      const file = results.rows[0];

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
  },
  create(req, res) {
    return res.render('admin/chefs/create');
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

    let results = await File.create(req.files[0]);
    const file_id = results.rows[0].id;

    const data = { ...req.body, file_id };
    results = await Chef.create(data);
    const chefId = results.rows[0].id;

    return res.redirect(`/admin/chefs/${chefId}`);
  },
  async show(req, res) {
    const { id } = req.params;

    let results = await Chef.find(id);
    const chef = results.rows[0];

    if (!chef) return res.send('Chef não encontrado!');

    results = await Chef.file(chef.file_id);
    chef.file = { ...results.rows[0] };
    chef.file.src = `${req.protocol}://${
      req.headers.host
    }${chef.file.path.replace('public', '')}`;

    results = await Chef.chefRecipes(id);
    const recipes = results.rows;

    async function getImage(recipeId) {
      let results = await Recipe.files(recipeId);
      const file = results.rows[0];

      return `${req.protocol}://${req.headers.host}${file.path.replace(
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
  },
  async edit(req, res) {
    const { id } = req.params;

    let results = await Chef.find(id);
    const chef = results.rows[0];

    if (!chef) return res.send('Chef não encontrado!');

    results = await Chef.file(chef.file_id);
    let file = { ...results.rows[0] };
    file.src = `${req.protocol}://${req.headers.host}${file.path.replace(
      'public',
      '',
    )}`;

    return res.render('admin/chefs/edit', { chef, file });
  },
  async put(req, res) {
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

    if (req.files.length == 0) {
      const results = await Chef.file(req.body.id);
      file_id = results.rows[0].id;
    }

    if (req.files.length != 0) {
      const results = await File.create(req.files[0]);
      file_id = results.rows[0].id;
    }

    const data = {
      ...req.body,
      file_id: file_id || req.body.file_id,
    };

    await Chef.update(data);

    if (req.body.removed_files) {
      const removedFileId = req.body.removed_files.replace(',', '');
      await File.delete(removedFileId);
    }

    return res.redirect(`/admin/chefs/${req.body.id}`);
  },
  async delete(req, res) {
    const { id } = req.body;

    await Chef.delete(id);

    res.redirect('/admin/chefs');
  },
};
