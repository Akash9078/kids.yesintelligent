// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Intersection Observer for better performance
const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const isAboveTheFold = el.getBoundingClientRect().top < window.innerHeight;
            
            el.classList.add('visible');
            if (isAboveTheFold) {
                el.classList.add('no-animation');
            }
            
            observer.unobserve(el); // Stop observing once animated
        }
    });
};

// Initialize observer
const observer = new IntersectionObserver(observerCallback, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
});

// Initialize animations
function initAnimations() {
    const elements = document.querySelectorAll('.motion-fade, .motion-pop');
    elements.forEach(el => observer.observe(el));
    
    // Immediate load for above-fold content
    elements.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add('visible', 'no-animation');
        }
    });
}

// Handle resize events efficiently
const handleResize = debounce(() => {
    document.querySelectorAll('.motion-fade, .motion-pop').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add('visible', 'no-animation');
        }
    });
}, 150);

// Event listeners
window.addEventListener('DOMContentLoaded', () => {
    initAnimations();

    // Add lazy loading to images
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
        // No need to set img.loading = 'lazy' again, it's already in HTML
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
});
