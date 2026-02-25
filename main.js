// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
    const isExpanded = navLinks.classList.contains('active');
    mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('nav') && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling — only for internal anchor links, not "#" alone
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return; // Skip bare "#" links (e.g. logo)
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });
});

// Scroll-reveal animation using IntersectionObserver
const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));
} else {
    // Fallback: show all elements immediately
    revealElements.forEach(el => el.classList.add('visible'));
}

// Form validation helpers
function showError(input, message) {
    input.classList.add('invalid');
    const errorEl = input.parentElement.querySelector('.form-error');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('visible');
    }
}

function clearError(input) {
    input.classList.remove('invalid');
    const errorEl = input.parentElement.querySelector('.form-error');
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
    }
}

// Clear error on input
document.querySelectorAll('.booking-form input, .booking-form select, .booking-form textarea').forEach(input => {
    input.addEventListener('input', () => clearError(input));
    input.addEventListener('change', () => clearError(input));
});

// Phone number validation pattern
function isValidPhone(phone) {
    // Accepts formats: +91 98765 43210, 9876543210, +919876543210, etc.
    const cleaned = phone.replace(/[\s\-()]/g, '');
    return /^\+?\d{10,13}$/.test(cleaned);
}

// Form submission
const bookingForm = document.getElementById('bookingForm');
const successModal = document.getElementById('successModal');
const submitBtn = bookingForm.querySelector('.form-submit');

bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate name
    const nameInput = document.getElementById('name');
    if (!nameInput.value.trim()) {
        showError(nameInput, 'Please enter your full name.');
        isValid = false;
    }

    // Validate phone
    const phoneInput = document.getElementById('phone');
    if (!phoneInput.value.trim()) {
        showError(phoneInput, 'Please enter your phone number.');
        isValid = false;
    } else if (!isValidPhone(phoneInput.value)) {
        showError(phoneInput, 'Please enter a valid phone number (10-13 digits).');
        isValid = false;
    }

    // Validate service
    const serviceInput = document.getElementById('service');
    if (!serviceInput.value) {
        showError(serviceInput, 'Please select a service.');
        isValid = false;
    }

    // Validate date
    const dateInput = document.getElementById('date');
    if (!dateInput.value) {
        showError(dateInput, 'Please select a preferred date.');
        isValid = false;
    }

    // Validate time
    const timeInput = document.getElementById('time');
    if (!timeInput.value) {
        showError(timeInput, 'Please select a preferred time.');
        isValid = false;
    }

    if (!isValid) return;

    // Disable button to prevent double-submit
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    // Get form data
    const formData = new FormData(bookingForm);
    const data = Object.fromEntries(formData);

    // TODO: In production, send this data to your backend
    console.log('Appointment Data:', data);

    // Simulate a short delay for UX
    setTimeout(() => {
        // Show success modal
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Reset form and button
        bookingForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Book Appointment';
    }, 500);
});

// Modal close
function closeModal() {
    successModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal button
document.querySelector('.modal-close').addEventListener('click', closeModal);

// Close modal when clicking outside
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successModal.classList.contains('active')) {
        closeModal();
    }
});

// Set minimum date for appointment booking to today
const dateInput = document.getElementById('date');
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);
