/**
 * Portfolio Application JavaScript
 * 
 * This file implements all interactive functionality following HCI principles:
 * - Norman's 7 Principles (Lectures 15-16)
 * - Shneiderman's 8 Golden Rules (Lecture 14)
 * - Nielsen's 10 Heuristics (Lecture 17)
 * - 5 E's of Usability (Lecture 2)
 * 
 * Note: All state management uses in-memory variables (no localStorage due to sandbox restrictions)
 */

// ============================================================================
// STATE MANAGEMENT
// ============================================================================
/**
 * HCI PRINCIPLE: Shneiderman's Rule #7 - Internal Locus of Control (Lecture 14)
 * User preferences are maintained in memory for session duration
 */
let currentTheme = 'light';
let currentSection = 'home';
let mobileMenuOpen = false;

// ============================================================================
// THEME MANAGEMENT
// ============================================================================
/**
 * HCI PRINCIPLE: Shneiderman's Rule #3 - Offer Informative Feedback (Lecture 14)
 * Theme toggle provides immediate visual feedback
 * 
 * HCI PRINCIPLE: Norman's Principle #3 - Make System States Visible (Lecture 15/16)
 * Theme state is visible through icon changes and color scheme
 */
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    
    // Check user's system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        currentTheme = 'dark';
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    /**
     * HCI PRINCIPLE: 5 E's of Usability - Enjoyable (Lecture 2)
     * Smooth transition creates pleasant user experience
     */
    console.log(`Theme switched to ${currentTheme} mode`);
}

// ============================================================================
// NAVIGATION MANAGEMENT
// ============================================================================
/**
 * HCI PRINCIPLE: Nielsen's Heuristic #1 - Visibility of System Status (Lecture 17)
 * Active section is clearly indicated in navigation
 * 
 * HCI PRINCIPLE: Nielsen's Heuristic #3 - User Control & Freedom (Lecture 17)
 * Users can freely navigate between sections
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileToggle = document.getElementById('mobileToggle');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            navigateToSection(sectionId);
            
            // Close mobile menu if open
            if (mobileMenuOpen) {
                toggleMobileMenu();
            }
        });
    });
    
    mobileToggle.addEventListener('click', toggleMobileMenu);
    
    // Handle footer links
    const footerLinks = document.querySelectorAll('.footer-links a[href^="#"]');
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            navigateToSection(sectionId);
        });
    });
}

/**
 * HCI PRINCIPLE: Norman's Principle #2 - Simplify Task Structure (Lecture 15/16)
 * Single-page navigation simplifies user mental model
 */
function navigateToSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
        
        /**
         * HCI PRINCIPLE: Nielsen's Heuristic #1 - Visibility of System Status (Lecture 17)
         * Update active nav link to show current location
         */
        updateActiveNavLink(sectionId);
        
        /**
         * HCI PRINCIPLE: 5 E's of Usability - Efficiency (Lecture 2)
         * Scroll to top for immediate content visibility
         */
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function updateActiveNavLink(sectionId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * HCI PRINCIPLE: Nielsen's Heuristic #7 - Flexibility & Efficiency of Use (Lecture 17)
 * Mobile menu provides efficient navigation on small screens
 */
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const mobileToggle = document.getElementById('mobileToggle');
    
    mobileMenuOpen = !mobileMenuOpen;
    
    navMenu.classList.toggle('active');
    mobileToggle.classList.toggle('active');
}

// ============================================================================
// FORM VALIDATION
// ============================================================================
/**
 * HCI PRINCIPLE: Shneiderman's Rule #5 - Error Prevention (Lecture 14)
 * Form validation prevents submission of invalid data
 * 
 * HCI PRINCIPLE: Nielsen's Heuristic #9 - Help Users Recognize/Diagnose/Recover from Errors (Lecture 17)
 * Clear error messages guide users to correct issues
 */
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
}

function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    let errorMessage = '';
    
    /**
     * HCI PRINCIPLE: Nielsen's Heuristic #5 - Error Prevention (Lecture 17)
     * Validation rules prevent common input errors
     */
    switch (fieldName) {
        case 'name':
            if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters';
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
            }
            break;
        case 'subject':
            if (value.length < 3) {
                errorMessage = 'Subject must be at least 3 characters';
            }
            break;
        case 'message':
            if (value.length < 10) {
                errorMessage = 'Message must be at least 10 characters';
            }
            break;
    }
    
    const errorElement = document.getElementById(`${fieldName}Error`);
    
    if (errorMessage) {
        field.classList.add('error');
        errorElement.textContent = errorMessage;
        return false;
    } else {
        field.classList.remove('error');
        errorElement.textContent = '';
        return true;
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const inputs = form.querySelectorAll('.form-input');
    let isValid = true;
    
    /**
     * HCI PRINCIPLE: 5 E's of Usability - Error-free (Lecture 2)
     * Comprehensive validation ensures error-free submissions
     */
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    const feedback = document.getElementById('formFeedback');
    
    if (isValid) {
        /**
         * HCI PRINCIPLE: Shneiderman's Rule #4 - Design Dialogs for Closure (Lecture 14)
         * Success message provides clear task completion feedback
         */
        feedback.className = 'form-feedback success';
        feedback.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
        
        /**
         * HCI PRINCIPLE: Shneiderman's Rule #6 - Permit Easy Reversal of Actions (Lecture 14)
         * Form is reset after successful submission
         */
        setTimeout(() => {
            form.reset();
            feedback.style.display = 'none';
        }, 5000);
        
        console.log('Form submitted:', {
            name: form.name.value,
            email: form.email.value,
            subject: form.subject.value,
            message: form.message.value
        });
    } else {
        /**
         * HCI PRINCIPLE: Nielsen's Heuristic #9 - Help Users Recognize/Diagnose/Recover from Errors (Lecture 17)
         * Error message helps users understand what went wrong
         */
        feedback.className = 'form-feedback error';
        feedback.textContent = '✗ Please fix the errors above before submitting.';
    }
}

// ============================================================================
// SCROLL ANIMATIONS
// ============================================================================
/**
 * HCI PRINCIPLE: 5 E's of Usability - Enjoyable (Lecture 2)
 * Subtle animations enhance user experience without being distracting
 */
function initScrollAnimations() {
    /**
     * HCI PRINCIPLE: Shneiderman's Rule #3 - Offer Informative Feedback (Lecture 14)
     * Navbar background changes on scroll to maintain visibility
     */
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.boxShadow = 'var(--shadow-sm)';
        }
    });
}

// ============================================================================
// KEYBOARD NAVIGATION
// ============================================================================
/**
 * HCI PRINCIPLE: Shneiderman's Rule #2 - Universal Usability (Lecture 14)
 * Keyboard navigation ensures accessibility for all users
 * 
 * HCI PRINCIPLE: Nielsen's Heuristic #7 - Flexibility & Efficiency of Use (Lecture 17)
 * Keyboard shortcuts provide efficient navigation for power users
 */
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Escape key closes mobile menu
        if (e.key === 'Escape' && mobileMenuOpen) {
            toggleMobileMenu();
        }
        
        // Tab navigation enhancement
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });
    
    // Remove keyboard navigation class on mouse use
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });
}

// ============================================================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================================================
/**
 * HCI PRINCIPLE: Shneiderman's Rule #2 - Universal Usability (Lecture 14)
 * Accessibility features ensure usability for users with disabilities
 */
function initAccessibility() {
    // Add focus styles for keyboard navigation
    const style = document.createElement('style');
    style.textContent = `
        .keyboard-nav *:focus {
            outline: 2px solid var(--accent-color);
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);
    
    /**
     * HCI PRINCIPLE: Nielsen's Heuristic #10 - Help & Documentation (Lecture 17)
     * ARIA labels provide context for screen reader users
     */
    const buttons = document.querySelectorAll('button:not([aria-label])');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label') && button.textContent.trim()) {
            button.setAttribute('aria-label', button.textContent.trim());
        }
    });
}

// ============================================================================
// PERFORMANCE OPTIMIZATION
// ============================================================================
/**
 * HCI PRINCIPLE: 5 E's of Usability - Efficiency (Lecture 2)
 * Debouncing improves performance during rapid events
 */
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

// ============================================================================
// SMOOTH SCROLL POLYFILL FOR OLDER BROWSERS
// ============================================================================
/**
 * HCI PRINCIPLE: Shneiderman's Rule #2 - Universal Usability (Lecture 14)
 * Polyfills ensure functionality across different browsers
 */
function initSmoothScroll() {
    // Modern browsers support this natively, this is for fallback
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 72; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ============================================================================
// ANALYTICS & LOGGING
// ============================================================================
/**
 * HCI PRINCIPLE: 5 E's of Usability - Effectiveness (Lecture 2)
 * Logging helps track user interactions for future improvements
 */
function logInteraction(action, details) {
    console.log(`User Action: ${action}`, details);
    // In production, this would send data to analytics service
}

// ============================================================================
// INITIALIZATION
// ============================================================================
/**
 * HCI PRINCIPLE: 5 E's of Usability - Ease of Use (Lecture 2)
 * Application initializes automatically with all features ready
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio Application Initialized');
    console.log('HCI Principles Implementation:');
    console.log('- Norman\'s 7 Principles (Lectures 15-16)');
    console.log('- Shneiderman\'s 8 Golden Rules (Lecture 14)');
    console.log('- Nielsen\'s 10 Heuristics (Lecture 17)');
    console.log('- Aesthetic Principles (Lecture 4)');
    console.log('- 5 E\'s of Usability (Lecture 2)');
    
    /**
     * HCI PRINCIPLE: 5 E's of Usability - Effectiveness (Lecture 2)
     * All features are initialized to ensure full functionality
     */
    initTheme();
    initNavigation();
    initFormValidation();
    initScrollAnimations();
    initKeyboardNavigation();
    initAccessibility();
    initSmoothScroll();
    
    // Log initial state
    logInteraction('Page Load', {
        theme: currentTheme,
        section: currentSection,
        timestamp: new Date().toISOString()
    });
    
    /**
     * HCI PRINCIPLE: Norman's Principle #3 - Make System States Visible (Lecture 15/16)
     * Initial section is displayed immediately
     */
    navigateToSection('home');
});

/**
 * HCI PRINCIPLE: Nielsen's Heuristic #9 - Help Users Recognize/Diagnose/Recover from Errors (Lecture 17)
 * Global error handler provides graceful error recovery
 */
window.addEventListener('error', (e) => {
    console.error('Application Error:', e.error);
    // In production, this would show a user-friendly error message
});

/**
 * HCI PRINCIPLE: Shneiderman's Rule #2 - Universal Usability (Lecture 14)
 * Responsive to window resize events
 */
window.addEventListener('resize', debounce(() => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768 && mobileMenuOpen) {
        toggleMobileMenu();
    }
}, 250));

/**
 * Export functions for testing (if needed)
 * This is a good practice for maintainable code
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        navigateToSection,
        toggleTheme,
        validateField,
        debounce
    };
}