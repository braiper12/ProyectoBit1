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

     fetch('partials/footer.html') 
    .then(response => {
      if (!response.ok) throw new Error('Error al cargar partials/footer.html');
      return response.text();
    })
    .then(data => {
      footer.innerHTML = data;
    })
    .catch(error => console.error('Error cargando footer:', error)); 


      fetch('partials/services.html') 
    .then(response => {
      if (!response.ok) throw new Error('Error al cargar partials/services.html');
      return response.text();
    })
    .then(data => {
      services.innerHTML = data;
    })
    .catch(error => console.error('Error cargando services:', error)); 
   });