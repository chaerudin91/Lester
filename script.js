// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const backToTopButton = document.getElementById('backToTop');
const contrastToggle = document.getElementById('contrastToggle');
const fontSizeIncrease = document.getElementById('fontSizeIncrease');
const fontSizeDecrease = document.getElementById('fontSizeDecrease');
const testimonialSlider = document.getElementById('testimonialSlider');
const prevTestimonialBtn = document.getElementById('prevTestimonial');
const nextTestimonialBtn = document.getElementById('nextTestimonial');
const testimonialIndicators = document.querySelectorAll('.indicator');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const newsletterForm = document.getElementById('newsletterForm');

// Variables
let currentSlide = 0;
let baseFontSize = parseInt(getComputedStyle(document.documentElement).fontSize);
const testimonialSlides = document.querySelectorAll('.testimonial-slide');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

// Inisialisasi Aplikasi
function initApp() {
    // Navigasi Scroll Effect
    window.addEventListener('scroll', handleScroll);
    
    // Hamburger Menu
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Smooth Scroll untuk Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', smoothScroll);
    });
    
    // Back to Top Button
    if (backToTopButton) {
        backToTopButton.addEventListener('click', scrollToTop);
        window.addEventListener('scroll', toggleBackToTopButton);
    }
    
    // Aksesibilitas
    if (contrastToggle) {
        contrastToggle.addEventListener('click', toggleContrast);
    }
    
    if (fontSizeIncrease) {
        fontSizeIncrease.addEventListener('click', increaseFontSize);
    }
    
    if (fontSizeDecrease) {
        fontSizeDecrease.addEventListener('click', decreaseFontSize);
    }
    
    // Testimonial Slider
    initTestimonialSlider();
    
    // Form Submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterForm);
    }
    
    // Animasi pada scroll
    initScrollAnimations();
    
    // Aktifkan slide pertama
    if (testimonialSlides.length > 0) {
        showSlide(0);
    }
}

// Fungsi Navigasi
function handleScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Aktifkan navigasi berdasarkan posisi scroll
    highlightNavOnScroll();
}

function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
}

function smoothScroll(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;
    
    const navHeight = navbar.offsetHeight;
    const targetPosition = targetElement.offsetTop - navHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
    
    // Tutup menu mobile jika terbuka
    if (navLinks.classList.contains('active')) {
        toggleMobileMenu();
    }
}

function highlightNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbar.offsetHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Back to Top
function toggleBackToTopButton() {
    if (window.scrollY > 500) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Aksesibilitas
function toggleContrast() {
    document.body.classList.toggle('high-contrast');
    localStorage.setItem('high-contrast', document.body.classList.contains('high-contrast'));
}

function increaseFontSize() {
    baseFontSize = Math.min(baseFontSize + 2, 24); // Maksimal 24px
    updateFontSize();
}

function decreaseFontSize() {
    baseFontSize = Math.max(baseFontSize - 2, 12); // Minimal 12px
    updateFontSize();
}

function updateFontSize() {
    document.documentElement.style.fontSize = `${baseFontSize}px`;
    localStorage.setItem('font-size', baseFontSize);
}

// Testimonial Slider
function initTestimonialSlider() {
    if (!testimonialSlider) return;
    
    // Tampilkan slide pertama
    showSlide(currentSlide);
    
    // Event listeners untuk navigasi slider
    if (prevTestimonialBtn) {
        prevTestimonialBtn.addEventListener('click', prevSlide);
    }
    
    if (nextTestimonialBtn) {
        nextTestimonialBtn.addEventListener('click', nextSlide);
    }
    
    // Event listeners untuk indikator
    testimonialIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Auto slide
    setInterval(nextSlide, 6000);
}

function showSlide(n) {
    // Reset slider
    testimonialSlides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    testimonialIndicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    // Update current slide index
    currentSlide = n;
    
    // Handle edge cases
    if (currentSlide >= testimonialSlides.length) {
        currentSlide = 0;
    }
    
    if (currentSlide < 0) {
        currentSlide = testimonialSlides.length - 1;
    }
    
    // Activate current slide and indicator
    testimonialSlides[currentSlide].classList.add('active');
    testimonialIndicators[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Form Handling
function handleContactForm(e) {
    e.preventDefault();
    
    // Simulasi pengiriman form (dalam aplikasi nyata akan mengirim ke server)
    const formData = new FormData(contactForm);
    const formDataObj = {};
    
    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });
    
    // Logging data form untuk tujuan demonstrasi
    console.log('Form data:', formDataObj);
    
    // Tampilkan pesan sukses
    contactForm.style.display = 'none';
    if (formSuccess) {
        formSuccess.style.display = 'block';
    }
    
    // Reset form setelah beberapa detik
    setTimeout(() => {
        contactForm.reset();
        contactForm.style.display = 'block';
        if (formSuccess) {
            formSuccess.style.display = 'none';
        }
    }, 5000);
}

function handleNewsletterForm(e) {
    e.preventDefault();
    
    // Simulasi berlangganan newsletter
    const email = newsletterForm.querySelector('input[type="email"]').value;
    
    console.log('Newsletter subscription:', email);
    
    // Tampilkan pesan sukses
    const newsletterBtn = newsletterForm.querySelector('button');
    const originalText = newsletterBtn.textContent;
    
    newsletterBtn.textContent = 'Berhasil Berlangganan!';
    newsletterBtn.style.backgroundColor = 'var(--success)';
    
    // Reset form setelah beberapa detik
    setTimeout(() => {
        newsletterForm.reset();
        newsletterBtn.textContent = originalText;
        newsletterBtn.style.backgroundColor = '';
    }, 3000);
}

// Animasi Scroll
function initScrollAnimations() {
    // Pilih semua elemen yang akan dianimasikan
    const animatedElements = document.querySelectorAll('.service-card, .step, .about-image, .about-text, .testimonial-content, .contact-content > *');
    
    // Observer options
    const options = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    // Callback untuk IntersectionObserver
    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Tambahkan kelas untuk animasi
                entry.target.classList.add('animate');
                // Hentikan observasi setelah animasi
                observer.unobserve(entry.target);
            }
        });
    };
    
    // Buat observer
    const observer = new IntersectionObserver(animateOnScroll, options);
    
    // Observe each element
    animatedElements.forEach(element => {
        // Tambahkan kelas dasar untuk animasi
        element.classList.add('scroll-animation');
        observer.observe(element);
    });
}

// Deteksi preferensi aksesibilitas yang disimpan
function loadAccessibilityPreferences() {
    // Kontras tinggi
    const highContrast = localStorage.getItem('high-contrast');
    if (highContrast === 'true') {
        document.body.classList.add('high-contrast');
    }
    
    // Ukuran font
    const savedFontSize = localStorage.getItem('font-size');
    if (savedFontSize) {
        baseFontSize = parseInt(savedFontSize);
        document.documentElement.style.fontSize = `${baseFontSize}px`;
    }
}

// Load accessibility preferences on startup
loadAccessibilityPreferences();

// Tambahkan kelas CSS untuk animasi pada scroll
document.addEventListener('DOMContentLoaded', function() {
    // Tambahkan kelas CSS untuk animasi
    const style = document.createElement('style');
    style.innerHTML = `
        .scroll-animation {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .scroll-animation.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .service-card {
            transition-delay: calc(var(--i, 0) * 0.1s);
        }
    `;
    document.head.appendChild(style);
    
    // Tambahkan delay berbeda untuk setiap service card
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.setProperty('--i', index);
    });
});

// Menambahkan validasi form
function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            markInvalid(input, 'Bidang ini wajib diisi');
            isValid = false;
        } else if (input.type === 'email' && input.value.trim() && !isValidEmail(input.value)) {
            markInvalid(input, 'Email tidak valid');
            isValid = false;
        } else {
            markValid(input);
        }
        
        // Tambahkan event listener untuk input saat fokus
        input.addEventListener('focus', function() {
            this.classList.remove('invalid');
            const errorMessage = this.parentNode.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
    });
    
    return isValid;
}

function markInvalid(input, message) {
    input.classList.add('invalid');
    
    // Hapus pesan error yang ada sebelumnya
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Tambahkan pesan error baru
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    input.parentNode.appendChild(errorMessage);
}

function markValid(input) {
    input.classList.remove('invalid');
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Aktifkan validasi form
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        if (!validateForm(this)) {
            e.preventDefault();
        }
    });
}

if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        if (!validateForm(this)) {
            e.preventDefault();
        }
    });
}

// Tambahkan CSS tambahan untuk validasi form
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.innerHTML = `
        .invalid {
            border-color: var(--error) !important;
            box-shadow: 0 0 0 2px rgba(204, 51, 99, 0.2) !important;
        }
        
        .error-message {
            color: var(--error);
            font-size: 0.85em;
            margin-top: 5px;
        }
    `;
    document.head.appendChild(style);
});

// Tambahkan efek hover yang lebih interaktif
document.addEventListener('DOMContentLoaded', function() {
    // Hover effect untuk service card
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    // Hover effect untuk tombol
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
});