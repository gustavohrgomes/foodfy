const { checkAllFields } = require('../../lib/utils');

async function post(req, res, next) {
  const fillAllFields = checkAllFields(req.body);
  if (fillAllFields) return res.send(fillAllFields.error);

  if (req.files.length == 0) {
    return res.send('Por favor, envie pelo menos 1 foto!');
  }

  next();
}

async function put(req, res, next) {
  const fillAllFields = checkAllFields(req.body);
  if (fillAllFields) return res.send(fillAllFields.error);

  if (req.body.removed_files && req.files == 0) {
    return res.send('Por favor, envie pelo menos 1 imagem.');
  }

  next();
}

module.exports = {
  post,
  put,
};
