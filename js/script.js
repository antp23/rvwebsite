// Chloride RV Park Website - JavaScript

// ======================
// DOM Ready
// ======================
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSmoothScroll();
    initHeaderScroll();
    initContactForm();
    initLazyLoading();
    initScrollAnimations();
});

// ======================
// Mobile Menu Toggle
// ======================
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOpen = document.getElementById('menu-open');
    const menuClose = document.getElementById('menu-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (!mobileMenuBtn || !mobileMenu) return;

    // Toggle menu on button click
    mobileMenuBtn.addEventListener('click', function() {
        const isOpen = mobileMenu.classList.contains('open');

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu when clicking on a nav link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });

    function openMenu() {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('open');
        menuOpen.classList.add('hidden');
        menuClose.classList.remove('hidden');
    }

    function closeMenu() {
        mobileMenu.classList.remove('open');
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
        }, 300);
        menuOpen.classList.remove('hidden');
        menuClose.classList.add('hidden');
    }
}

// ======================
// Smooth Scrolling
// ======================
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            // Calculate offset for fixed header
            const headerHeight = document.getElementById('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// ======================
// Header Scroll Effect
// ======================
function initHeaderScroll() {
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add shadow when scrolled
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ======================
// Contact Form Handling
// ======================
function initContactForm() {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Check honeypot
        const honeypot = form.querySelector('input[name="honeypot"]');
        if (honeypot && honeypot.value !== '') {
            // Spam detected
            return;
        }

        // Validate form
        if (!validateForm(form)) {
            showMessage('Please fill in all required fields correctly.', 'error');
            return;
        }

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Remove honeypot from data
        delete data.honeypot;

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<div class="spinner" style="width: 24px; height: 24px; border-width: 2px;"></div>';

        // Simulate form submission (replace with actual backend endpoint)
        setTimeout(() => {
            // In production, you would send data to your backend here
            // Example: fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })

            console.log('Form data:', data);

            // Show success message
            showMessage('Thank you for your inquiry! We\'ll get back to you soon.', 'success');

            // Reset form
            form.reset();

            // Restore button
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }, 1500);
    });

    function validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('border-red-500');
            } else {
                field.classList.remove('border-red-500');
            }
        });

        // Validate email
        const emailField = form.querySelector('input[type="email"]');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                isValid = false;
                emailField.classList.add('border-red-500');
            }
        }

        // Validate phone
        const phoneField = form.querySelector('input[type="tel"]');
        if (phoneField && phoneField.value) {
            const phoneRegex = /^[\d\s\-\(\)]+$/;
            if (!phoneRegex.test(phoneField.value)) {
                isValid = false;
                phoneField.classList.add('border-red-500');
            }
        }

        return isValid;
    }

    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = type === 'success' ? 'form-success p-4 rounded-md text-center' : 'form-error p-4 rounded-md text-center';
        formMessage.classList.remove('hidden');

        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.classList.add('hidden');
        }, 5000);
    }
}

// ======================
// Lazy Loading Images
// ======================
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        images.forEach(img => {
            img.classList.add('loaded');
        });
    }
}

// ======================
// Scroll Animations
// ======================
function initScrollAnimations() {
    const sections = document.querySelectorAll('section');

    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal');
                }
            });
        }, {
            threshold: 0.1
        });

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }
}

// ======================
// Click to Call Analytics (Optional)
// ======================
function trackPhoneClick() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Track phone click event
            console.log('Phone number clicked');

            // If using Google Analytics:
            // gtag('event', 'phone_click', {
            //     'event_category': 'engagement',
            //     'event_label': 'Phone Number Click'
            // });
        });
    });
}

// Initialize analytics tracking
trackPhoneClick();

// ======================
// Form Submit Analytics (Optional)
// ======================
function trackFormSubmit() {
    const form = document.getElementById('contact-form');

    if (form) {
        form.addEventListener('submit', function() {
            console.log('Form submitted');

            // If using Google Analytics:
            // gtag('event', 'form_submit', {
            //     'event_category': 'engagement',
            //     'event_label': 'Contact Form Submission'
            // });
        });
    }
}

// Initialize form tracking
trackFormSubmit();

// ======================
// Utility Functions
// ======================

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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ======================
// Performance Monitoring
// ======================
window.addEventListener('load', function() {
    // Log page load time
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log('Page load time:', loadTime + 'ms');
    }
});
