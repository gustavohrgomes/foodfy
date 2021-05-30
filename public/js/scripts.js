// Link Active for navbar
const menuItems = document.querySelectorAll('.links a');
const currentPage = location.pathname;

for (let item of menuItems) {
  if (currentPage.includes(item.getAttribute('href'))) {
    item.classList.add('active');
  }
}

// =============================================================

// Redirect for recipe details
const cards = document.querySelectorAll('.recipe');

for (let card of cards) {
  card.addEventListener('click', () => {
    const recipeId = card.getAttribute('id');
    window.location.href = `/recipes/${recipeId}`;
    console.log(recipeId);
  });
}

// =============================================================

// Hide/Show Button
const contentToHide = document.querySelectorAll('.recipe-hide');

for (let item of contentToHide) {
  const hideShowButton = item.querySelector('.hide');

  hideShowButton.addEventListener('click', () => {
    item.querySelector('.content').classList.toggle('hidden');
    if (hideShowButton.innerHTML == 'ESCONDER') {
      hideShowButton.innerHTML = 'MOSTRAR';
    } else {
      hideShowButton.innerHTML = 'ESCONDER';
    }
  });
}

// =============================================================

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
  input: '',
  uploadLimit: 5,
  preview: document.querySelector('#photos-preview'),
  files: [],
  handleFileInput(event) {
    const { files: fileList } = event.target;
    PhotosUpload.input = event.target;

    if (PhotosUpload.hasLimit(event)) return;

    Array.from(fileList).forEach(file => {
      PhotosUpload.files.push(file);

      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();
        image.src = String(reader.result);

        const div = PhotosUpload.getContainer(image);
        PhotosUpload.preview.appendChild(div);
      };

      reader.readAsDataURL(file);
    });

    PhotosUpload.input.files = PhotosUpload.getAllFiles();
  },
  hasLimit(event) {
    const { uploadLimit, input, preview } = PhotosUpload;
    const { files: fileList } = input;

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos`);
      event.preventDefault();
      return true;
    }

    const photosDiv = [];
    preview.childNodes.forEach(item => {
      if (item.classList && item.classList.value == 'photo')
        photosDiv.push(item);
    });

    const totalPhotos = fileList.length + photosDiv.length;
    if (totalPhotos > uploadLimit) {
      alert('Você atingiu o limite máximo de fotos');
      event.preventDefault();
      return true;
    }

    return false;
  },
  getAllFiles() {
    const dataTransfer =
      new ClipboardEvent('').clipboardData || new DataTransfer();

    PhotosUpload.files.forEach(file => dataTransfer.items.add(file));

    return dataTransfer.files;
  },
  getContainer(image) {
    const div = document.createElement('div');
    div.classList.add('photo');

    div.onclick = PhotosUpload.removePhoto;

    div.appendChild(image);
    div.appendChild(PhotosUpload.getRemoveButton());

    return div;
  },
  getRemoveButton() {
    const button = document.createElement('i');
    button.classList.add('material-icons');
    button.innerHTML = 'close';

    return button;
  },
  removePhoto(event) {
    const photoDiv = event.target.parentNode;
    const photosArray = Array.from(PhotosUpload.preview.children);
    const index = photosArray.indexOf(photoDiv);

    PhotosUpload.files.splice(index, 1);
    PhotosUpload.input.files = PhotosUpload.getAllFiles();

    photoDiv.remove();
  },
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode;

    if (photoDiv.id) {
      const removedFiles = document.querySelector(
        'input[name="removed_files"]',
      );

      if (removedFiles) {
        removedFiles.value += `${photoDiv.id},`;
      }
    }

    photoDiv.remove();
  },
};

const ImageGallery = {
  highlight: document.querySelector('.gallery .highlight > img'),
  previews: document.querySelectorAll('.gallery-preview img'),
  setImage(event) {
    const { target } = event;

    ImageGallery.previews.forEach(preview =>
      preview.classList.remove('active'),
    );

    target.classList.add('active');

    ImageGallery.highlight.src = target.src;
  },
};

const Validate = {
  apply(input, func) {
    Validate.clearErrors(input);

    let results = Validate[func](input.value);
    input.value = results.value;

    if (results.error) {
      Validate.displayError(input, results.error);
    }
  },
  displayError(input, error) {
    const div = document.createElement('div');
    div.classList.add('error');
    div.innerHTML = error;
    input.classList.add('input-error-outline');
    input.parentNode.appendChild(div);
    input.focus();
  },
  clearErrors(input) {
    const errorDiv = input.parentNode.querySelector('.error');
    if (errorDiv) {
      errorDiv.remove();
      input.classList.remove('input-error-outline');
    }
  },
  isEmail(value) {
    let error = null;

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!value.match(mailFormat)) {
      error = 'Email Inválido';
    }

    return {
      error,
      value,
    };
  },
  allFields(event) {
    const items = document.querySelectorAll(
      '.input-group input, .input-group select, .input-group textarea',
    );
    for (item of items) {
      if (item.value == '') {
        const message = document.createElement('div');
        message.classList.add('messages');
        message.classList.add('error');
        message.style.position = 'fixed';
        message.innerHTML = 'Todos os campos são obrigatórios. 😉';
        document.querySelector('body').append(message);

        event.preventDefault();
      }
    }
  },
};
