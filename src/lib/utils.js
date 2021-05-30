const Recipe = require('../app/models/Recipe');

module.exports = {
  age(timeStamp) {
    const today = new Date();
    const birthDate = new Date(timeStamp);

    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    if (month < 0 || (month == 0 && today.getDate() < birthDate.getDate())) {
      age = age - 1;
    }

    return age;
  },
  date(timeStamp) {
    const date = new Date(timeStamp);

    const year = date.getUTCFullYear();
    const month = `0${date.getUTCMonth() + 1}`.slice(-2);
    const day = `0${date.getUTCDate()}`.slice(-2);

    return {
      iso: `${year}-${month}-${day}`,
      birthDay: `${day}/${month}`,
      format: `${day}/${month}/${year}`,
    };
  },
  checkAllFields(body) {
    const keys = Object.keys(body);

    for (value of keys) {
      if (body[value] == '' && value != 'removed_files') {
        return {
          user: body,
          error: 'Por favor, preencha todos os campos!',
        };
      }
    }
  },
  async getImages(recipeId) {
    let files = await Recipe.files(recipeId);
    files = files.map(file => ({
      ...file,
      src: `${file.path.replace('public', '')}`,
    }));
    return files;
  },
};
