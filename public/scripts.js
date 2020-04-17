const cards = document.querySelectorAll('.card');

for (let card of cards) {
  card.addEventListener('click', () => {
    
  });
}

/* document.querySelector('.close-modal').addEventListener('click', () => {
  modalOverlay.classList.remove('active');
});

modalOverlay.addEventListener('click', () => {
  modalOverlay.classList.remove('active');
}); */

const currentPage = location.pathname
const menuItems = document.querySelectorAll('.navbar .nav-link a')

for (let item of menuItems) {
  
  if (currentPage.includes(item.getAttribute('href'))) {
    item.classList.add('link-active')
  }
}
