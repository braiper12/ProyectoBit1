// scripts.js
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  if (!navbar) {
    console.error('Elemento "navbar" no encontrado');
    return;
  }

  fetch('partials/navbar.html') 
    .then(response => {
      if (!response.ok) throw new Error('Error al cargar partials/navbar.html');
      return response.text();
    })
    .then(data => {
      navbar.innerHTML = data;
    })
    .catch(error => console.error('Error cargando navbar:', error)); 
   });