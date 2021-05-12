module.exports = {
  index(req, res) {
    const { user } = req;

    return res.render('admin/profile/index', { user });
  },
  put(req, res) {},
};
