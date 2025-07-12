// Simple performance monitoring
const measurePerformance = (label, fn) => {
    performance.mark(`${label}-start`);
    fn();
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
};

// Download button animation
const initDownloadButtons = () => {
    const buttons = document.querySelectorAll('.download-button');
    
    buttons.forEach(button => {
        // Add click animation
        button.addEventListener('click', () => {
            button.classList.remove('animate');
            void button.offsetWidth; // Trigger reflow
            button.classList.add('animate');
        });
        
        // Initial attention-grabbing animation
        setTimeout(() => {
            button.classList.add('animate');
            // Remove the class after animation completes
            button.addEventListener('animationend', () => {
                button.classList.remove('animate');
            }, { once: true });
        }, 1000);
    });
};

// Image loading handler
const handleImageLoading = (img) => {
    img.addEventListener('load', () => img.classList.add('loaded'));
    img.addEventListener('error', () => {
        console.warn(`Failed to load image: ${img.src}`);
        img.src = '/img/fallback.webp';  // Using a real fallback image path
    });
};

// Initialize lazy loading
const initLazyLoading = () => {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    // Set up image loading handlers
    images.forEach(handleImageLoading);

    // Add lazysizes fallback if needed
    if (!('loading' in HTMLImageElement.prototype)) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        script.async = true;
        script.onerror = () => images.forEach(img => img.src = img.dataset.src || img.src);
        document.head.appendChild(script);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    measurePerformance('init', () => {
        initLazyLoading();
        initDownloadButtons();
    });
});