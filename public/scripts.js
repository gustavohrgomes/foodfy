// Link Active for navbar
const menuItems = document.querySelectorAll('.navbar .nav-link a')
const currentPage = location.pathname

for (let item of menuItems) {
  if (currentPage.includes(item.getAttribute('href'))) {
    item.classList.add('link-active')
  }
}

// Redirect for recipe details
const cards = document.querySelectorAll('.card');

for (let card of cards) {
  card.addEventListener('click', () => {
    const recipeId = card.getAttribute('id');
    window.location.href = `/recipes/${recipeId}`
    console.log(recipeId)
  });
}

// Hide/Show Button
const buttons = document.querySelectorAll('.btn-collapse')

for (let button of buttons) {
  button.addEventListener('click', () => {
    const target = document.querySelector(`#${button.getAttribute('target')} .details`)

    target.classList.toggle('hide-details')

    if (target.classList.contains('hide-details')){
      button.textContent = 'mostrar'
    }
    else {
      button.textContent = 'esconder'
    }
  })
}

/* function hideDetails(index) {
  buttons[index].addEventListener('click', () => {
    
    if (details[index].classList.contains('hide-details')) {
      details[index].classList.remove('hide-details')
      buttons[index].innerHTML = 'esconder'
    }
    else {
      details[index].classList.add('hide-details')
      buttons[index].innerHTML = 'mostrar'
    }
  })
}

for (let i = 0; i < 3; i++) {
  hideDetails(i)
} */

/* document.querySelector('.close-modal').addEventListener('click', () => {
  modalOverlay.classList.remove('active');
});

modalOverlay.addEventListener('click', () => {
  modalOverlay.classList.remove('active');
}); */