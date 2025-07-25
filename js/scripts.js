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

// ====================================
// VISOR DE IMÁGENES DETALLADO
// ====================================

class ImageViewer {
    constructor() {
        this.currentIndex = 0;
        this.zoomLevel = 1;
        this.images = [];
        this.modal = null;
        this.modalImg = null;
        this.isModalOpen = false;
        
        this.init();
    }

    init() {
        this.createModal();
        this.bindEvents();
        this.scanImages();
    }

    // Crear el modal dinámicamente
    createModal() {
        const modalHTML = `
            <div id="imageModal" class="image-modal" style="display: none;">
                <div class="modal-backdrop"></div>
                <div class="modal-container">
                    <div class="modal-header">
                        <div class="zoom-controls">
                            <button class="zoom-btn" id="zoomOut" title="Alejar">
                                <i class="fas fa-search-minus"></i>
                            </button>
                            <button class="zoom-btn" id="resetZoom" title="Tamaño original">
                                <i class="fas fa-undo"></i>
                            </button>
                            <button class="zoom-btn" id="zoomIn" title="Acercar">
                                <i class="fas fa-search-plus"></i>
                            </button>
                        </div>
                        <button class="close-btn" id="closeModal" title="Cerrar">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="modal-content">
                        <button class="nav-btn prev-btn" id="prevImage" title="Imagen anterior">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        
                        <div class="image-container">
                            <img id="modalImage" class="modal-image" alt="Imagen detallada">
                            <div class="loading-spinner" id="loadingSpinner">
                                <i class="fas fa-spinner fa-spin"></i>
                            </div>
                        </div>
                        
                        <button class="nav-btn next-btn" id="nextImage" title="Imagen siguiente">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    
                    <div class="modal-footer">
                        <div class="image-info">
                            <span class="image-counter" id="imageCounter"></span>
                            <span class="image-title" id="imageTitle"></span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        this.modal = document.getElementById('imageModal');
        this.modalImg = document.getElementById('modalImage');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        
        this.addModalStyles();
    }

    // Agregar estilos CSS dinámicamente
    addModalStyles() {
        if (document.getElementById('imageViewerStyles')) return;
        
        const styles = `
            <style id="imageViewerStyles">
                .image-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 9999;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .image-modal.show {
                    opacity: 1;
                }
                
                .modal-backdrop {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                }
                
                .modal-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    box-sizing: border-box;
                }
                
                .modal-header {
                    position: absolute;
                    top: 20px;
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 20px;
                    z-index: 10;
                }
                
                .zoom-controls {
                    display: flex;
                    gap: 10px;
                }
                
                .zoom-btn, .close-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    padding: 10px;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                    width: 45px;
                    height: 45px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .zoom-btn:hover, .close-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(1.1);
                }
                
                .modal-content {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                    position: relative;
                }
                
                .nav-btn {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    padding: 15px;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                    width: 60px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                }
                
                .prev-btn {
                    left: 20px;
                }
                
                .next-btn {
                    right: 20px;
                }
                
                .nav-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-50%) scale(1.1);
                }
                
                .image-container {
                    position: relative;
                    max-width: 90%;
                    max-height: 80%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .modal-image {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    border-radius: 8px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    transition: transform 0.3s ease;
                    cursor: grab;
                }
                
                .modal-image:active {
                    cursor: grabbing;
                }
                
                .loading-spinner {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-size: 2rem;
                    display: none;
                }
                
                .loading-spinner.show {
                    display: block;
                }
                
                .modal-footer {
                    position: absolute;
                    bottom: 20px;
                    width: 100%;
                    text-align: center;
                    z-index: 10;
                }
                
                .image-info {
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    padding: 15px 25px;
                    border-radius: 25px;
                    backdrop-filter: blur(10px);
                    display: inline-block;
                }
                
                .image-counter {
                    font-size: 1rem;
                    margin-right: 15px;
                    opacity: 0.8;
                }
                
                .image-title {
                    font-size: 1.2rem;
                    font-weight: 600;
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .nav-btn {
                        display: none;
                    }
                    
                    .zoom-controls {
                        flex-wrap: wrap;
                        gap: 5px;
                    }
                    
                    .zoom-btn, .close-btn {
                        width: 40px;
                        height: 40px;
                        padding: 8px;
                    }
                    
                    .modal-header {
                        flex-direction: column;
                        gap: 10px;
                        align-items: flex-end;
                    }
                    
                    .image-info {
                        padding: 10px 15px;
                        font-size: 0.9rem;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // Escanear imágenes existentes en la página
    scanImages() {
        // Buscar imágenes en la galería específica
        const images = document.querySelectorAll('#gallery-container .gallery-item img, img[data-gallery], .gallery img, .imagen-detalle');
        images.forEach((img, index) => {
            // Obtener el título del overlay si existe
            const overlay = img.parentElement.querySelector('.gallery-overlay h4');
            const title = overlay ? overlay.textContent : (img.alt || img.title || `Imagen ${index + 1}`);
            
            this.images.push({
                src: img.dataset.full || img.src.replace('w=500&h=300&fit=crop', 'w=1200&h=800&fit=crop'), // Imagen más grande
                title: title,
                element: img
            });
            
            img.style.cursor = 'pointer';
            img.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openModal(index);
            });
        });
    }

    // Agregar imagen manualmente
    addImage(element, fullSrc = null, title = null) {
        const index = this.images.length;
        this.images.push({
            src: fullSrc || element.src,
            title: title || element.alt || element.title || `Imagen ${index + 1}`,
            element: element
        });
        
        element.style.cursor = 'pointer';
        element.addEventListener('click', () => this.openModal(index));
    }

    bindEvents() {
        // Cerrar modal
        document.addEventListener('click', (e) => {
            if (e.target.id === 'closeModal' || e.target.closest('#closeModal')) {
                this.closeModal();
            }
            if (e.target.classList.contains('modal-backdrop')) {
                this.closeModal();
            }
        });
        
        // Navegación
        document.addEventListener('click', (e) => {
            if (e.target.id === 'prevImage' || e.target.closest('#prevImage')) {
                this.prevImage();
            }
            if (e.target.id === 'nextImage' || e.target.closest('#nextImage')) {
                this.nextImage();
            }
        });
        
        // Controles de zoom
        document.addEventListener('click', (e) => {
            if (e.target.id === 'zoomIn' || e.target.closest('#zoomIn')) {
                this.zoomIn();
            }
            if (e.target.id === 'zoomOut' || e.target.closest('#zoomOut')) {
                this.zoomOut();
            }
            if (e.target.id === 'resetZoom' || e.target.closest('#resetZoom')) {
                this.resetZoom();
            }
        });
        
        // Eventos de teclado
        document.addEventListener('keydown', (e) => {
            if (!this.isModalOpen) return;
            
            switch(e.key) {
                case 'Escape':
                    this.closeModal();
                    break;
                case 'ArrowLeft':
                    this.prevImage();
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    break;
                case '+':
                case '=':
                    e.preventDefault();
                    this.zoomIn();
                    break;
                case '-':
                    e.preventDefault();
                    this.zoomOut();
                    break;
                case '0':
                    e.preventDefault();
                    this.resetZoom();
                    break;
            }
        });
        
        // Zoom con rueda del mouse
        document.addEventListener('wheel', (e) => {
            if (!this.isModalOpen || !e.target.closest('.modal-image')) return;
            
            e.preventDefault();
            if (e.deltaY < 0) {
                this.zoomIn();
            } else {
                this.zoomOut();
            }
        });
        
        // Touch events para móviles
        this.bindTouchEvents();
    }

    bindTouchEvents() {
        let startX = 0;
        let startY = 0;
        let isDragging = false;
        
        document.addEventListener('touchstart', (e) => {
            if (!this.isModalOpen || !e.target.closest('.modal-image')) return;
            
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = false;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!this.isModalOpen || !e.target.closest('.modal-image')) return;
            isDragging = true;
        });
        
        document.addEventListener('touchend', (e) => {
            if (!this.isModalOpen || isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Swipe horizontal para navegación
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 100) {
                if (diffX > 0) {
                    this.nextImage();
                } else {
                    this.prevImage();
                }
            }
            
            // Swipe vertical para cerrar
            if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 150) {
                this.closeModal();
            }
        });
    }

    openModal(index) {
        if (this.images.length === 0) return;
        
        this.currentIndex = index;
        this.isModalOpen = true;
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            this.modal.classList.add('show');
        }, 10);
        
        this.loadImage();
    }

    closeModal() {
        this.isModalOpen = false;
        this.modal.classList.remove('show');
        document.body.style.overflow = '';
        
        setTimeout(() => {
            this.modal.style.display = 'none';
            this.resetZoom();
        }, 300);
    }

    loadImage() {
        if (!this.images[this.currentIndex]) return;
        
        const imageData = this.images[this.currentIndex];
        this.showLoading(true);
        
        const img = new Image();
        img.onload = () => {
            this.modalImg.src = imageData.src;
            this.modalImg.alt = imageData.title;
            this.updateInfo();
            this.showLoading(false);
        };
        
        img.onerror = () => {
            this.showLoading(false);
            console.error('Error al cargar la imagen:', imageData.src);
        };
        
        img.src = imageData.src;
    }

    showLoading(show) {
        if (show) {
            this.loadingSpinner.classList.add('show');
        } else {
            this.loadingSpinner.classList.remove('show');
        }
    }

    updateInfo() {
        const counter = document.getElementById('imageCounter');
        const title = document.getElementById('imageTitle');
        
        if (counter) counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
        if (title) title.textContent = this.images[this.currentIndex].title;
    }

    prevImage() {
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.images.length - 1;
        this.resetZoom();
        this.loadImage();
    }

    nextImage() {
        this.currentIndex = this.currentIndex < this.images.length - 1 ? this.currentIndex + 1 : 0;
        this.resetZoom();
        this.loadImage();
    }

    zoomIn() {
        this.zoomLevel = Math.min(this.zoomLevel * 1.2, 3);
        this.applyZoom();
    }

    zoomOut() {
        this.zoomLevel = Math.max(this.zoomLevel / 1.2, 0.5);
        this.applyZoom();
    }

    resetZoom() {
        this.zoomLevel = 1;
        this.applyZoom();
    }

    applyZoom() {
        this.modalImg.style.transform = `scale(${this.zoomLevel})`;
    }
}

// ====================================
// INICIALIZACIÓN Y API PÚBLICA
// ====================================

let imageViewer = null;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    imageViewer = new ImageViewer();
});

// También reinicializar después de filtrar la galería
function reinitializeImageViewer() {
    if (imageViewer) {
        imageViewer.images = [];
        imageViewer.scanImages();
    }
}

// Función mejorada para el filtro de galería (actualiza la existente si la tienes)
function filterGallery(category) {
    const items = document.querySelectorAll('.gallery-item');
    const buttons = document.querySelectorAll('.filter-btn');
    
    // Actualizar botones activos
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filtrar elementos
    items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
            item.style.opacity = '1';
        } else {
            item.style.display = 'none';
            item.style.opacity = '0';
        }
    });
    
    // Reinicializar el visor de imágenes después del filtrado
    setTimeout(() => {
        reinitializeImageViewer();
    }, 100);
}

// API pública para uso externo
window.ImageViewerAPI = {
    // Agregar imagen individual
    addImage: function(element, fullSrc = null, title = null) {
        if (imageViewer) {
            imageViewer.addImage(element, fullSrc, title);
        }
    },
    
    // Abrir imagen específica por índice
    openImage: function(index) {
        if (imageViewer) {
            imageViewer.openModal(index);
        }
    },
    
    // Obtener instancia del visor
    getInstance: function() {
        return imageViewer;
    }
};

// ====================================
// FUNCIONES DE UTILIDAD
// ====================================

// Función para convertir imágenes existentes en clickeables
function convertirImagenesClickeables(selector = 'img') {
    const images = document.querySelectorAll(selector);
    images.forEach(img => {
        if (imageViewer && !img.dataset.viewerAdded) {
            imageViewer.addImage(img);
            img.dataset.viewerAdded = 'true';
        }
    });
}

// Función para agregar una sola imagen
function agregarImagenDetalle(elemento, urlCompleta = null, titulo = null) {
    if (imageViewer) {
        imageViewer.addImage(elemento, urlCompleta, titulo);
    }
}