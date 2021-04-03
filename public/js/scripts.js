// Link Active for navbar
const menuItems = document.querySelectorAll('.navbar a');
const currentPage = location.pathname;

for (let item of menuItems) {
  if (currentPage.includes(item.getAttribute('href'))) {
    item.classList.add('link-active');
  }
}

// =============================================================

// Redirect for recipe details
const cards = document.querySelectorAll('.card');

for (let card of cards) {
  card.addEventListener('click', () => {
    const recipeId = card.getAttribute('id');
    window.location.href = `/recipes/${recipeId}`;
    console.log(recipeId);
  });
}

// =============================================================

// Hide/Show Button
function hideAndShow(buttons) {
  for (let button of buttons) {
    button.addEventListener('click', () => {
      const target = document.querySelector(
        `#${button.getAttribute('target')} .details`,
      );

      target.classList.toggle('hide-details');

      if (target.classList.contains('hide-details')) {
        button.textContent = 'mostrar';
      } else {
        button.textContent = 'esconder';
      }
    });
  }
}

const buttons = document.querySelectorAll('.btn-collapse');

if (buttons) {
  hideAndShow(buttons);
}

// =============================================================

// Add ingredients and preparation

function addIngredient() {
  const ingredients = document.querySelector('#ingredients');
  const inputContainer = document.querySelectorAll('.ingredients__input');

  // Realiza um clone do último ingrediente adicionado
  const newInput = inputContainer[inputContainer.length - 1].cloneNode(true);

  // Não adiciona um novo input se o último tem um valor vazio
  if (newInput.children[0].value == '') return false;

  // Deixa o valor do input vazio
  newInput.children[0].value = '';
  ingredients.appendChild(newInput);
}

function addPreparing() {
  const preparing = document.querySelector('#preparing');
  const inputContainer = document.querySelectorAll('.preparing__input');

  const newInput = inputContainer[inputContainer.length - 1].cloneNode(true);

  if (newInput.children[0].value == '') return false;

  newInput.children[0].value = '';
  preparing.appendChild(newInput);
}

const addIngredientAction = document.querySelector('.add-ingredient');
const addPreparationStep = document.querySelector('.add-preparing');

if (addIngredientAction) {
  addIngredientAction.addEventListener('click', addIngredient);
}

if (addPreparationStep) {
  addPreparationStep.addEventListener('click', addPreparing);
}

// Paginação

function paginate(selectedPage, totalPages) {
  let pages = [];
  let oldPage;

  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
    const firstAndLastPage = currentPage == 1 || currentPage == totalPages;
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 2;
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2;

    if (
      firstAndLastPage ||
      (pagesBeforeSelectedPage && pagesAfterSelectedPage)
    ) {
      if (oldPage && currentPage - oldPage > 2) {
        pages.push('...');
      }
      if (oldPage && currentPage - oldPage == 2) {
        pages.push(oldPage + 1);
      }

      pages.push(currentPage);

      oldPage = currentPage;
    }
  }

  return pages;
}

function createPagination(pagination) {
  const filter = pagination.dataset.filter;
  const page = Number(pagination.dataset.page);
  const total = Number(pagination.dataset.total);
  const pages = paginate(page, total);

  let elements = '';

  for (let page of pages) {
    if (String(page).includes('...')) {
      elements += `<span>${page}</span>`;
    } else {
      if (filter) {
        elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`;
      } else {
        elements += `<a href="?page=${page}">${page}</a>`;
      }
    }
  }

  pagination.innerHTML = elements;
}

const pagination = document.querySelector('.pagination');

if (pagination) {
  createPagination(pagination);
}

const PhotosUpload = {
  uploadLimit: 5,
  handleFileInput(event) {
    const { files: fileList } = event.target;
    const { uploadLimit } = PhotosUpload;

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos`);
      event.preventDefault();
      return;
    }

    Array.from(fileList).forEach(file => {
      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();
        image.src = String(reader.result);

        const div = document.createElement('div');
        div.classList.add('photo');

        div.onclick = () => alert('Remover foto');

        div.appendChild(image);

        document.querySelector('#photos-preview').appendChild(div);
      };

      reader.readAsDataURL(file);
    });
  },
};
