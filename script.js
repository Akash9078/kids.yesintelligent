// KidsWorksheets - Main JavaScript File

// Global variables
let ticking = false;

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Initialize observers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Observe all elements with observer-element class
    const elements = document.querySelectorAll('.observer-element');
    elements.forEach(el => observer.observe(el));
    
    // Initialize other features
    initSmoothScrolling();
    initButtonEffects();
    initCardEffects();
    initFloatingAnimations();
    initCounterAnimations();
});

// Modern smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Enhanced hover effects for buttons
function initButtonEffects() {
    const allButtons = document.querySelectorAll('button');
    
    allButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Mouse tracking effect for cards
function initCardEffects() {
    const cards = document.querySelectorAll('.feature-card, .testimonial-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
        });
    });
}

// Add random delays to floating animations
function initFloatingAnimations() {
    const floatingElements = document.querySelectorAll('.animate-float, .animate-bounce-slow, .animate-pulse-slow');
    floatingElements.forEach(el => {
        el.style.animationDelay = Math.random() * 3 + 's';
    });
}

// Dynamic counter animation for numbers
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target.toLocaleString() + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString() + '+';
        }
    }, 16);
}

// Animate counters when they come into view
function initCounterAnimations() {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                if (entry.target.textContent.includes('12,000')) {
                    animateCounter(entry.target, 12000);
                } else if (entry.target.textContent.includes('5,000')) {
                    animateCounter(entry.target, 5000);
                }
            }
        });
    });
    
    // Observe counter elements
    const counters = document.querySelectorAll('.footer-stat-value:not([data-animated])');
    counters.forEach(counter => {
        if (counter.textContent.includes('12,000') || counter.textContent.includes('5,000')) {
            counterObserver.observe(counter);
        }
    });
}

// Parallax effect for background elements
document.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
});

function updateScrollEffects() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    const backgroundElements = document.querySelectorAll('.absolute');
    backgroundElements.forEach((el, index) => {
        if (el.classList.contains('animate-float')) {
            el.style.transform = `translateY(${rate * (index + 1) * 0.1}px)`;
        }
    });
    
    ticking = false;
}

// Sample Worksheets Modal Functions
function openSampleModal() {
    const modal = document.getElementById('sampleModal');
    
    // Calculate scrollbar width and add padding to prevent shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = scrollbarWidth + 'px';
    document.body.style.overflow = 'hidden';
    
    modal.classList.add('active');
}

function closeSampleModal(event) {
    // Only close if clicking the backdrop or close button, not the modal content
    if (event && event.target !== event.currentTarget && !event.target.closest('[onclick="closeSampleModal()"]')) {
        return;
    }
    
    const modal = document.getElementById('sampleModal');
    modal.classList.remove('active');
    
    // Remove padding and restore scroll
    document.body.style.paddingRight = '';
    document.body.style.overflow = '';
}

function handleSampleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const name = form.parentName.value;
    const email = form.parentEmail.value;
    
    // Add loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '🔄 Sending...';
    submitButton.disabled = true;
    
    // Prepare data for webhook
    const webhookData = {
        name: name,
        email: email,
        type: 'sample_request',
        timestamp: new Date().toISOString(),
        source: 'kids_worksheets_landing_page'
    };
    
    // Send data to n8n webhook
    fetch('https://n8ndroplet.yesintelligent.com/webhook/ab9cf5b8-9ec2-4741-99a4-5f85e2158216', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
    })
    .then(response => {
        if (response.ok) {
            // Success state
            submitButton.innerHTML = '✅ Success! Check Your Email';
            submitButton.style.background = 'linear-gradient(90deg, #22c55e, #16a34a)';
            
            // Show success message
            setTimeout(() => {
                alert(`🎉 SUCCESS!\n\nHi ${name}!\n\nYour FREE sample worksheets are on their way to ${email}!\n\nCheck your inbox in the next few minutes (don't forget to check spam folder).\n\n📚 You'll receive:\n• 10 Premium sample worksheets\n• Math, Reading & Science activities\n• Weekly educational tips\n• Exclusive parent resources\n\nThank you for choosing KidsWorksheets! 💝`);
                closeSampleModal();
                
                // Reset form after modal closes
                setTimeout(() => {
                    form.reset();
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                    submitButton.style.background = '';
                }, 500);
            }, 1000);
            
            console.log('Sample request submitted successfully:', webhookData);
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .catch(error => {
        console.error('Error submitting form:', error);
        
        // Error state
        submitButton.innerHTML = '❌ Error - Please Try Again';
        submitButton.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            submitButton.style.background = '';
        }, 3000);
        
        alert('⚠️ Something went wrong!\n\nPlease check your internet connection and try again.\n\nIf the problem persists, please contact our support team.');
    });
}

// Contact Form Submit Handler
function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const name = form.contactName.value;
    const email = form.contactEmail.value;
    const message = form.contactMessage.value;
    
    // Add loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '🔄 Sending...';
    submitButton.disabled = true;
    
    // Prepare data for webhook
    const webhookData = {
        name: name,
        email: email,
        message: message,
        type: 'contact_form',
        timestamp: new Date().toISOString(),
        source: 'kids_worksheets_landing_page'
    };
    
    // Send data to n8n webhook
    fetch('https://n8ndroplet.yesintelligent.com/webhook/99f7be89-af8d-48ab-9f59-1812bfaca3e3', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
    })
    .then(response => {
        if (response.ok) {
            // Success
            submitButton.innerHTML = '✅ Message Sent!';
            form.reset();
            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 3000);
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        alert('There was an error sending your message. Please try again or contact us directly.');
    });
}

// Policy Modal Functions
function openPrivacyModal() {
    const modal = document.getElementById('privacyModal');
    
    // Calculate scrollbar width and add padding to prevent shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = scrollbarWidth + 'px';
    document.body.style.overflow = 'hidden';
    
    modal.classList.add('active');
}

function closePrivacyModal(event) {
    if (event && event.target !== event.currentTarget && !event.target.closest('[onclick="closePrivacyModal()"]')) {
        return;
    }
    
    const modal = document.getElementById('privacyModal');
    modal.classList.remove('active');
    
    // Remove padding and restore scroll
    document.body.style.paddingRight = '';
    document.body.style.overflow = '';
}

function openTermsModal() {
    const modal = document.getElementById('termsModal');
    
    // Calculate scrollbar width and add padding to prevent shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = scrollbarWidth + 'px';
    document.body.style.overflow = 'hidden';
    
    modal.classList.add('active');
}

function closeTermsModal(event) {
    if (event && event.target !== event.currentTarget && !event.target.closest('[onclick="closeTermsModal()"]')) {
        return;
    }
    
    const modal = document.getElementById('termsModal');
    modal.classList.remove('active');
    
    // Remove padding and restore scroll
    document.body.style.paddingRight = '';
    document.body.style.overflow = '';
}

function openRefundModal() {
    const modal = document.getElementById('refundModal');
    
    // Calculate scrollbar width and add padding to prevent shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = scrollbarWidth + 'px';
    document.body.style.overflow = 'hidden';
    
    modal.classList.add('active');
}

function closeRefundModal(event) {
    if (event && event.target !== event.currentTarget && !event.target.closest('[onclick="closeRefundModal()"]')) {
        return;
    }
    
    const modal = document.getElementById('refundModal');
    modal.classList.remove('active');
    
    // Remove padding and restore scroll
    document.body.style.paddingRight = '';
    document.body.style.overflow = '';
}

// Close modal with Escape key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeSampleModal();
        closePrivacyModal();
        closeTermsModal();
        closeRefundModal();
    }
});

// Performance optimization: Throttle scroll events
function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    updateScrollEffects();
}, 16); // ~60fps

document.addEventListener('scroll', throttledScrollHandler);
