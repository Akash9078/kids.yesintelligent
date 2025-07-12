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

// Function to highlight content based on selected age group
function highlightAge(ageGroup) {
    // Remove active state from all buttons
    document.querySelectorAll('[onclick^="highlightAge"]').forEach(btn => {
        btn.classList.remove('ring-2', 'ring-offset-2');
    });

    // Add active state to clicked button
    event.target.classList.add('ring-2', 'ring-offset-2');

    // Scroll to relevant bundle based on age
    let targetSection;
    switch(ageGroup) {
        case '2-4':
            targetSection = 'Preschool Power Pack';
            break;
        case '5-7':
            targetSection = 'Creative Genius Kit';
            break;
        case '8+':
            targetSection = 'Little Scholar Set';
            break;
    }

    // Find and scroll to the relevant section
    const bundle = Array.from(document.getElementsByTagName('h3')).find(h => h.textContent.includes(targetSection));
    if (bundle) {
        bundle.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Highlight the bundle temporarily
        bundle.closest('div').classList.add('ring-4', 'ring-offset-4', 'ring-blue-500');
        setTimeout(() => {
            bundle.closest('div').classList.remove('ring-4', 'ring-offset-4', 'ring-blue-500');
        }, 2000);
    }
}

// Initialize scroll animations
const initScrollAnimations = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all sections with motion-fade class
    document.querySelectorAll('.motion-fade').forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    measurePerformance('init', () => {
        initLazyLoading();
        initDownloadButtons();
        initScrollAnimations();
    });
});