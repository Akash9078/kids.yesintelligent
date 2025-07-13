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
    switch (ageGroup) {
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
    measurePerformance('initialization', () => {
        initDownloadButtons();
        initLazyLoading();
        initLeadForm();
        initContactForm();
        initAgeSelector();
        initParentsReviews();
        initScrollAnimations();
    });
});

// Lead Form Submission Handling
const initLeadForm = () => {
    const form = document.getElementById('leadForm');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const thankYouMessage = document.getElementById('thankYouMessage');
    const errorMessage = document.getElementById('errorMessage');

    if (!form) return; // Exit if form doesn't exist

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Reset messages
        thankYouMessage.classList.add('hidden');
        errorMessage.classList.add('hidden');
        emailError.classList.add('hidden');

        // Email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(emailInput.value)) {
            emailError.classList.remove('hidden');
            return;
        }

        const name = document.getElementById('name').value;
        const email = emailInput.value;

        const webhookUrl = 'https://n8ndroplet.yesintelligent.com/webhook/6caaa899-e75a-4040-88c5-6456fef81142';

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email }),
            });

            if (response.ok) {
                thankYouMessage.classList.remove('hidden');
                form.reset(); // Clear the form
            } else {
                errorMessage.classList.remove('hidden');
                console.error('Webhook submission failed:', response.status, response.statusText);
            }
        } catch (error) {
            errorMessage.classList.remove('hidden');
            console.error('Error submitting form:', error);
        }
    });
};

// Contact form handling
const initContactForm = () => {
    const contactForm = document.getElementById('contactForm');
    const contactError = document.getElementById('contactError');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Hide any previous error messages
            contactError.classList.add('hidden');
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            // Basic validation
            if (!name || !email || !message) {
                contactError.textContent = 'Please fill in all fields.';
                contactError.classList.remove('hidden');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                contactError.textContent = 'Please enter a valid email address.';
                contactError.classList.remove('hidden');
                return;
            }

            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<span class="inline-flex items-center"><svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Sending...</span>';
            submitButton.disabled = true;

            try {
                // Send to your webhook
                const webhookUrl = 'https://n8ndroplet.yesintelligent.com/webhook/6caaa899-e75a-4040-88c5-6456fef81142';
                
                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        name, 
                        email, 
                        message,
                        timestamp: new Date().toISOString(),
                        source: 'Kids Activity Kit Contact Form'
                    }),
                });

                if (response.ok) {
                    // Show success message
                    contactForm.innerHTML = `
                        <div class="text-center py-8">
                            <div class="text-green-500 text-6xl mb-4">✓</div>
                            <h3 class="text-2xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                            <p class="text-gray-600">Thank you for reaching out. We'll get back to you soon!</p>
                        </div>
                    `;
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
            } catch (error) {
                console.error('Error submitting contact form:', error);
                contactError.textContent = 'Failed to submit form. Please try again.';
                contactError.classList.remove('hidden');
            } finally {
                // Restore button state only if there was an error
                if (contactForm.querySelector('button[type="submit"]')) {
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                }
            }
        });
    }
};

// Background image rotation for contact form
const initContactFormBackgrounds = () => {
    const contactSection = document.querySelector('.contact-form-bg');
    
    // Array of kid-friendly background images from Pexels
    const backgroundImages = [
        'https://images.pexels.com/photos/1148496/pexels-photo-1148496.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/159579/arts-and-crafts-pencil-color-creativity-159579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/1037993/pexels-photo-1037993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/1181269/pexels-photo-1181269.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/1020315/pexels-photo-1020315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ];
    
    let currentImageIndex = 0;
    
    // Function to change background
    const changeBackground = () => {
        if (contactSection) {
            const newImage = backgroundImages[currentImageIndex];
            const gradient = 'linear-gradient(rgba(147, 51, 234, 0.15), rgba(219, 39, 119, 0.15), rgba(244, 63, 94, 0.15))';
            
            contactSection.style.backgroundImage = `${gradient}, url('${newImage}')`;
            
            // Move to next image
            currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
        }
    };
    
    // Start the automatic cycling
    if (contactSection) {
        // Set initial background
        changeBackground();
        
        // Change background every 4 seconds
        setInterval(changeBackground, 4000);
    }
};

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    measurePerformance('initialization', () => {
        initDownloadButtons();
        initLazyLoading();
        initLeadForm();
        initContactForm();
        initContactFormBackgrounds();
        initAgeSelector();
        initParentsReviews();
        initScrollAnimations();
    });
});