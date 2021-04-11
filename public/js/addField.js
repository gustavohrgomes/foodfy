const addIngredient = document.querySelector('.add-ingredient');
const addPreparingStep = document.querySelector('.add-step');

function addField(fieldId, fieldClass) {
  const id = document.querySelector(fieldId);
  const fieldContainer = document.querySelectorAll(fieldClass);
  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

  if (newField.children[0].value == '') return false;

  newField.children[0].value = '';

  id.appendChild(newField);
}

addIngredient.addEventListener('click', () =>
  addField('#ingredients', '.ingredients'),
);

addPreparingStep.addEventListener('click', () =>
  addField('#preparing', '.steps'),
);
