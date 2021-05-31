const { unlinkSync } = require('fs');

const Chef = require('../models/Chef');
const File = require('../models/File');

const LoadChefService = require('../services/LoadChefService');

module.exports = {
  async index(req, res) {
    try {
      const chefs = await LoadChefService.load('chefs');
      return res.render('admin/chefs/index', { chefs });
    } catch (error) {
      console.log(error);
    }
  },
  create(req, res) {
    return res.render('admin/chefs/create');
  },
  async post(req, res) {
    try {
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
      const chef = await LoadChefService.load('chef', req.params.id);

      return res.render('admin/chefs/show', { chef });
    } catch (error) {
      console.log(error);
    }
  },
  async edit(req, res) {
    try {
      const chef = await LoadChefService.load('chef', req.params.id);
      if (!chef) return res.send('Chef não encontrado!');
      return res.render('admin/chefs/edit', { chef });
    } catch (error) {
      console.log(error);
    }
  },
  async put(req, res) {
    try {
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

      return res.redirect(`/admin/chefs/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  },
  async delete(req, res) {
    try {
      await Chef.delete({ id: req.body.id });

      const file = await File.findOne({ where: { id: req.body.file_id } });
      await File.delete({ id: file.id });
      if (file.path != 'public/images/chef_placeholder.png') {
        unlinkSync(file.path);
      }

      res.redirect('/admin/chefs');
    } catch (error) {
      throw new Error(error);
    }
  },
};
