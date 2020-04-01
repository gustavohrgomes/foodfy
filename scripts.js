const modalOverlay = document.querySelector('.modal-overlay');
const modal = document.querySelector('.modal');
const cards = document.querySelectorAll('.card');

for (let card of cards) {
  card.addEventListener('click', () => {
    const cardImg = card.querySelector('img').getAttribute('src');
    const cardTitle = card.querySelector('.card__title p').innerHTML;
    const cardDescription = card.querySelector('.card__description p').innerHTML;
    
    modalOverlay.querySelector('.modal__image img').src = `${cardImg}`;
    modalOverlay.querySelector('.modal__title').innerHTML = `${cardTitle}`;
    modalOverlay.querySelector('.modal__info').innerHTML = `${cardDescription}`;

    modalOverlay.classList.add('active');
  });
}

document.querySelector('.close-modal').addEventListener('click', () => {
  modalOverlay.classList.remove('active');
});

modalOverlay.addEventListener('click', () => {
  modalOverlay.classList.remove('active');
});