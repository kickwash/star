/**
 * ImageGridComponent - Reusable 3x3 thumbnail grid with click-to-maximize
 * Compatible with modern browsers, responsive, touch-friendly
 */
class ImageGridComponent {
  constructor(container, images, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.images = images;
    this.options = {
      aspectRatio: '1/1', // Square by default
      gap: '8px',
      borderRadius: '8px',
      transition: '0.3s ease',
      maxWidth: '600px',
      ...options
    };
    
    this.currentMaximized = null;
    this.init();
  }

  init() {
    if (!this.container) {
      console.error('ImageGridComponent: Container not found');
      return;
    }

    this.createStyles();
    this.render();
    this.bindEvents();
  }

  createStyles() {
    // Check if styles already exist
    if (document.getElementById('image-grid-styles')) return;

    const styleSheet = document.createElement('style');
    styleSheet.id = 'image-grid-styles';
    styleSheet.textContent = `
      .image-grid-component {
        width: 100%;
        max-width: min(90vw, ${this.options.maxWidth});
        margin: 0 auto;
        position: relative;
        user-select: none;
      }

      .image-grid-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: ${this.options.gap};
        aspect-ratio: ${this.options.aspectRatio};
        transition: all ${this.options.transition};
      }

      .image-grid-item {
        position: relative;
        overflow: hidden;
        border-radius: ${this.options.borderRadius};
        cursor: pointer;
        transition: all ${this.options.transition};
        background: #f0f0f0;
      }

      .image-grid-item:hover {
        transform: scale(1.02);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }

      .image-grid-item img {
        width: 100%;
        aspect-ratio: 1/1;
        object-fit: cover;
        display: block;
        transition: all ${this.options.transition};
      }

      .image-grid-item.maximized {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) !important;
        z-index: 1000;
        width: 90vw;
        max-width: 800px;
        max-height: 800px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        border-radius: ${this.options.borderRadius};
        aspect-ratio: 1/1;
      }

      .image-grid-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.8);
        z-index: 999;
        opacity: 0;
        transition: opacity ${this.options.transition};
        pointer-events: none;
      }

      .image-grid-overlay.active {
        opacity: 1;
        pointer-events: all;
      }

      .image-grid-close-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 40px;
        height: 40px;
        background: rgba(255,255,255,0.9);
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: #333;
        z-index: 1001;
        transition: all 0.2s ease;
        opacity: 0;
      }

      .image-grid-item.maximized .image-grid-close-btn {
        opacity: 1;
      }

      .image-grid-close-btn:hover {
        background: rgba(255,255,255,1);
        transform: scale(1.1);
      }

      /* Before/After horizontal banners */
      .image-grid-item .before-after-banner {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 16px;
        z-index: 10;
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .image-grid-item .before-after-banner.antes {
        background-color: #5b6770
      }

      .image-grid-item .before-after-banner.despues {
        background-color: #7b95a0;
      }

      .image-grid-item .before-after-banner::after {
        content: attr(data-label);
        color: white;
        font-size: 10px;
        font-weight: bold;
        text-transform: uppercase;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        letter-spacing: 0.5px;
      }

      /* Mobile optimizations */
      @media (max-width: 768px) {
        .image-grid-component {
          width: 100%;
          max-width: 350px;
          padding: 0 5px;
        }
        
        .image-grid-container {
          gap: 4px;
        }
        
        .image-grid-item.maximized {
          width: 95vw;
          aspect-ratio: 1/1;
        }
        
        .image-grid-close-btn {
          width: 50px;
          height: 50px;
          font-size: 20px;
        }
      }

      /* Loading state */
      .image-grid-item.loading {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }

      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `;
    
    document.head.appendChild(styleSheet);
  }

  render() {
    this.container.className = 'image-grid-component';
    
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'image-grid-overlay';
    document.body.appendChild(this.overlay);

    // Create grid container
    const gridContainer = document.createElement('div');
    gridContainer.className = 'image-grid-container';

    // Create grid items
    this.images.forEach((imageData, index) => {
      const item = document.createElement('div');
      item.className = 'image-grid-item loading';
      item.dataset.index = index;

      const img = document.createElement('img');
      
      // Handle different image data formats
      if (typeof imageData === 'string') {
        img.src = imageData;
        img.alt = `Image ${index + 1}`;
      } else if (typeof imageData === 'object') {
        img.src = imageData.src || imageData.url;
        img.alt = imageData.alt || `Image ${index + 1}`;
        if (imageData.title) item.title = imageData.title;
      }

      // Add loading handlers
      img.onload = () => item.classList.remove('loading');
      img.onerror = () => {
        item.classList.remove('loading');
        item.style.background = '#ddd';
        img.style.display = 'none';
      };

      // Create before/after banner if specified
      if (typeof imageData === 'object' && (imageData.type === 'antes' || imageData.type === 'despues')) {
        const banner = document.createElement('div');
        banner.className = `before-after-banner ${imageData.type}`;
        banner.setAttribute('data-label', imageData.type);
        item.appendChild(banner);
      }

      // Create close button (hidden by default)
      const closeBtn = document.createElement('button');
      closeBtn.className = 'image-grid-close-btn';
      closeBtn.innerHTML = '×';
      closeBtn.setAttribute('aria-label', 'Close image');

      item.appendChild(img);
      item.appendChild(closeBtn);
      gridContainer.appendChild(item);
    });

    this.container.appendChild(gridContainer);
    this.gridContainer = gridContainer;
  }

  bindEvents() {
    // Handle clicks on grid items
    this.gridContainer.addEventListener('click', (e) => {
      const item = e.target.closest('.image-grid-item');
      if (!item) return;

      if (item.classList.contains('maximized')) {
        this.minimizeImage();
      } else {
        this.maximizeImage(item);
      }
    });

    // Handle overlay click
    this.overlay.addEventListener('click', () => {
      this.minimizeImage();
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.currentMaximized) {
        this.minimizeImage();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (this.currentMaximized) {
        // Recalculate maximized position on resize
        this.currentMaximized.style.transform = 'translate(-50%, -50%)';
      }
    });

    // Prevent body scroll when maximized
    this.preventBodyScroll();
  }

  maximizeImage(item) {
    if (this.currentMaximized) {
      this.minimizeImage();
    }

    this.currentMaximized = item;
    item.classList.add('maximized');
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Trigger custom event
    this.container.dispatchEvent(new CustomEvent('imageMaximized', {
      detail: { 
        index: parseInt(item.dataset.index),
        imageData: this.images[parseInt(item.dataset.index)]
      }
    }));
  }

  minimizeImage() {
    if (!this.currentMaximized) return;

    this.currentMaximized.classList.remove('maximized');
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';

    // Trigger custom event
    this.container.dispatchEvent(new CustomEvent('imageMinimized', {
      detail: { 
        index: parseInt(this.currentMaximized.dataset.index),
        imageData: this.images[parseInt(this.currentMaximized.dataset.index)]
      }
    }));

    this.currentMaximized = null;
  }

  preventBodyScroll() {
    // Prevent background scrolling on mobile when overlay is active
    let touchStartY = 0;
    
    this.overlay.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    });

    this.overlay.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });
  }

  // Public methods
  updateImages(newImages) {
    this.images = newImages;
    this.container.innerHTML = '';
    this.render();
    this.bindEvents();
  }

  getCurrentMaximized() {
    return this.currentMaximized ? parseInt(this.currentMaximized.dataset.index) : null;
  }

  destroy() {
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    this.container.innerHTML = '';
    this.currentMaximized = null;
  }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageGridComponent;
}

if (typeof window !== 'undefined') {
  window.ImageGridComponent = ImageGridComponent;
}