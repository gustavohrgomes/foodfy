const Profile = require('../models/Profile');

function checkAllFields(body) {
  const keys = Object.keys(body);

  for (value of keys) {
    if (body[value] == '') {
      return { user: body, error: 'Por favor, preencha todos os campos.' };
    }
  }
}

async function index(req, res, next) {
  const { userId: id } = req.session;

  const userProfile = await Profile.findOne({ where: { id } });

  if (userProfile === null || userProfile === undefined) {
    return res.render('admin/profile/index', {
      error: 'Usuário não encontrado',
    });
  }

  req.user = userProfile;

  next();
}

module.exports = {
  index,
};
