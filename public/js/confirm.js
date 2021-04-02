const formDelete = document.querySelector('#form-delete');
formDelete.addEventListener('submit', function (event) {
  const confirmResponse = confirm('Deseja deleter esse registro?');
  if (!confirmResponse) {
    event.preventDefault();
  }
});
