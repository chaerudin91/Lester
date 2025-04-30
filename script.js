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
const sendAnotherMessage = document.getElementById('sendAnotherMessage');

// Variables
let currentSlide = 0;
let baseFontSize = parseInt(getComputedStyle(document.documentElement).fontSize);
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
let autoSlideInterval;
let isAutoSliding = true;
let touchStartX = 0;
let touchEndX = 0;

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

// Deteksi perangkat mobile
const isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

// Inisialisasi Aplikasi
function initApp() {
    // Navigasi Scroll Effect
    window.addEventListener('scroll', handleScroll);
    
    // Hamburger Menu
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Tutup mobile menu ketika klik di luar
    document.addEventListener('click', function(e) {
        if (navLinks && navLinks.classList.contains('active') && 
            !e.target.closest('.nav-container') && 
            !e.target.closest('.hamburger')) {
            toggleMobileMenu();
        }
    });
    
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
    
    // Touch events for testimonial slider
    if (testimonialSlider) {
        testimonialSlider.addEventListener('touchstart', handleTouchStart, { passive: true });
        testimonialSlider.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        // Pause auto-sliding when user interacts with the slider
        testimonialSlider.addEventListener('mouseenter', pauseAutoSlide);
        testimonialSlider.addEventListener('mouseleave', resumeAutoSlide);
        testimonialSlider.addEventListener('touchstart', pauseAutoSlide, { passive: true });
        testimonialSlider.addEventListener('touchend', function() {
            setTimeout(resumeAutoSlide, 3000); // Resume after 3 seconds
        }, { passive: true });
    }
    
    // Form Submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterForm);
    }
    
    // Send Another Message button
    if (sendAnotherMessage) {
        sendAnotherMessage.addEventListener('click', function(e) {
            e.preventDefault();
            formSuccess.style.display = 'none';
            contactForm.style.display = 'block';
        });
    }
    
    // Animasi pada scroll
    initScrollAnimations();
    
    // Aktifkan slide pertama
    if (testimonialSlides.length > 0) {
        showSlide(0);
    }
    
    // Lazy loading images
    initLazyLoading();
    
    // Optimize hover effects for touch devices
    if (isMobile.any()) {
        document.body.classList.add('touch-device');
        optimizeForTouchDevices();
    }
    
    // Menyiapkan dropdown submenu jika ada
    setupSubmenus();
    
    // Load accessibility preferences on startup
    loadAccessibilityPreferences();
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
    
    // Throttle untuk performa yang lebih baik pada mobile
    if (!window.requestAnimationFrame) {
        // Fallback untuk browser lama
        setTimeout(function() {
            toggleBackToTopButton();
        }, 300);
    } else {
        window.requestAnimationFrame(function() {
            toggleBackToTopButton();
        });
    }
}

function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Mencegah scrolling pada body ketika menu mobile terbuka
    if (navLinks.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function smoothScroll(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;
    
    // Offset yang lebih besar untuk mobile
    const navHeight = navbar.offsetHeight;
    const isMobileView = window.innerWidth <= 768;
    const extraOffset = isMobileView ? 20 : 0;
    const targetPosition = targetElement.offsetTop - navHeight - extraOffset;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
    
    // Tutup menu mobile jika terbuka
    if (navLinks && navLinks.classList.contains('active')) {
        toggleMobileMenu();
    }
}

function highlightNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    const scrollPosition = window.scrollY + window.innerHeight / 3;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbar.offsetHeight;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
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

// Setup Submenu (jika ada)
function setupSubmenus() {
    const hasSubmenu = document.querySelectorAll('.has-submenu');
    
    hasSubmenu.forEach(item => {
        const submenuToggle = item.querySelector('.submenu-toggle');
        const submenu = item.querySelector('.submenu');
        
        if (submenuToggle && submenu) {
            submenuToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle submenu
                submenu.classList.toggle('active');
                
                // Toggle icon
                this.classList.toggle('active');
                
                // Tutup submenu lain yang terbuka
                hasSubmenu.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherSubmenu = otherItem.querySelector('.submenu');
                        const otherToggle = otherItem.querySelector('.submenu-toggle');
                        
                        if (otherSubmenu && otherSubmenu.classList.contains('active')) {
                            otherSubmenu.classList.remove('active');
                            if (otherToggle) otherToggle.classList.remove('active');
                        }
                    }
                });
            });
            
            // Tutup submenu jika klik di luar
            document.addEventListener('click', function(e) {
                if (!item.contains(e.target) && submenu.classList.contains('active')) {
                    submenu.classList.remove('active');
                    if (submenuToggle) submenuToggle.classList.remove('active');
                }
            });
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
    // Smooth scroll dengan button yang selalu visible saat scrolling up
    const scrollStep = -window.scrollY / 15;
    const scrollInterval = setInterval(function() {
        if (window.scrollY !== 0) {
            window.scrollBy(0, scrollStep);
        } else {
            clearInterval(scrollInterval);
        }
    }, 15);
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

// Touch events for slider
function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50; // Minimal jarak swipe
    
    if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe kiri
        nextSlide();
    } else if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe kanan
        prevSlide();
    }
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
    
    // Auto slide dengan interval yang disimpan untuk pause/resume
    startAutoSlide();
}

function startAutoSlide() {
    isAutoSliding = true;
    autoSlideInterval = setInterval(nextSlide, 6000);
}

function pauseAutoSlide() {
    if (isAutoSliding) {
        clearInterval(autoSlideInterval);
        isAutoSliding = false;
    }
}

function resumeAutoSlide() {
    if (!isAutoSliding) {
        startAutoSlide();
    }
}

function showSlide(n) {
    // Reset slider
    testimonialSlides.forEach(slide => {
        slide.classList.remove('active');
        slide.setAttribute('aria-hidden', 'true'); // Accessibility
    });
    
    testimonialIndicators.forEach(indicator => {
        indicator.classList.remove('active');
        indicator.setAttribute('aria-selected', 'false'); // Accessibility
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
    testimonialSlides[currentSlide].setAttribute('aria-hidden', 'false'); // Accessibility
    
    testimonialIndicators[currentSlide].classList.add('active');
    testimonialIndicators[currentSlide].setAttribute('aria-selected', 'true'); // Accessibility
    
    // Preload next slide for better performance
    const nextSlideIndex = (currentSlide + 1) % testimonialSlides.length;
    testimonialSlides[nextSlideIndex].classList.add('preload');
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
    
    // Validasi form
    if (!validateForm(contactForm)) {
        return;
    }
    
    // Simulasi pengiriman form (dalam aplikasi nyata akan mengirim ke server)
    const formData = new FormData(contactForm);
    const formDataObj = {};
    
    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });
    
    // Logging data form untuk tujuan demonstrasi
    console.log('Form data:', formDataObj);
    
    // Tampilkan pesan sukses dengan animasi
    contactForm.style.opacity = 0;
    
    setTimeout(() => {
        contactForm.style.display = 'none';
        contactForm.style.opacity = 1;
        
        if (formSuccess) {
            formSuccess.style.display = 'block';
            formSuccess.style.opacity = 0;
            
            setTimeout(() => {
                formSuccess.style.opacity = 1;
            }, 10);
        }
    }, 300);
    
    // Reset form jika user tidak melihat tombol "Send Another"
    if (!sendAnotherMessage) {
        setTimeout(() => {
            contactForm.reset();
            contactForm.style.display = 'block';
            
            if (formSuccess) {
                formSuccess.style.display = 'none';
            }
        }, 5000);
    }
}

function handleNewsletterForm(e) {
    e.preventDefault();
    
    // Validasi form
    if (!validateForm(newsletterForm)) {
        return;
    }
    
    // Simulasi berlangganan newsletter
    const email = newsletterForm.querySelector('input[type="email"]').value;
    
    console.log('Newsletter subscription:', email);
    
    // Tampilkan pesan sukses
    const newsletterBtn = newsletterForm.querySelector('button');
    const originalText = newsletterBtn.textContent;
    
    // Status loading pada button
    newsletterBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    newsletterBtn.disabled = true;
    
    // Simulasi loading
    setTimeout(() => {
        newsletterBtn.innerHTML = '<i class="fas fa-check"></i> Berhasil Berlangganan!';
        newsletterBtn.style.backgroundColor = 'var(--success)';
        newsletterBtn.style.borderColor = 'var(--success)';
        
        // Reset form setelah beberapa detik
        setTimeout(() => {
            newsletterForm.reset();
            newsletterBtn.innerHTML = originalText;
            newsletterBtn.style.backgroundColor = '';
            newsletterBtn.style.borderColor = '';
            newsletterBtn.disabled = false;
        }, 3000);
    }, 1000);
}

// Animasi Scroll
function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
        // Fallback untuk browser lama
        return;
    }
    
    // Pilih semua elemen yang akan dianimasikan
    const animatedElements = document.querySelectorAll(
        '.service-card, .step, .about-image, .about-text, ' +
        '.testimonial-content, .contact-card, .contact-content > *, ' +
        '.hero-stat, .cta-feature'
    );
    
    // Observer options
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
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

// Lazy loading images untuk performa yang lebih baik
function initLazyLoading() {
    if (!('IntersectionObserver' in window)) {
        // Fallback untuk browser lama
        return;
    }
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                
                // Tambahkan event listener untuk mendeteksi saat gambar telah di-load
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
                
                lazyImageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => {
        lazyImageObserver.observe(img);
    });
}

// Optimasi untuk device touchscreen
function optimizeForTouchDevices() {
    // Ganti hover events dengan click/touch events
    const hoverElements = document.querySelectorAll('.service-card, .contact-card, .step');
    
    hoverElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-hover');
        }, { passive: true });
        
        // Tutup "touch-hover" saat user tap di tempat lain
        document.addEventListener('touchstart', function(e) {
            if (!element.contains(e.target)) {
                element.classList.remove('touch-hover');
            }
        }, { passive: true });
    });
    
    // Optimasi untuk tombol yang kecil agar lebih mudah di-tap
    const smallButtons = document.querySelectorAll('.testimonial-control, .social-icon');
    smallButtons.forEach(button => {
        button.classList.add('touch-target');
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
    
    // Deteksi preferensi sistem untuk warna
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Jika user mengatur tema gelap di sistem
        document.body.classList.add('prefer-dark');
    }
    
    // Deteksi preferensi sistem untuk mengurangi animasi
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Jika user mengatur preferensi mengurangi animasi di sistem
        document.body.classList.add('reduced-motion');
    }
}

// Menambahkan validasi form
function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            markInvalid(input, 'Bidang ini wajib diisi');
            isValid = false;
        } else if (input.type === 'email' && input.value.trim() && !isValidEmail(input.value)) {
            markInvalid(input, 'Email tidak valid');
            isValid = false;
        } else if (input.type === 'tel' && input.value.trim() && !isValidPhone(input.value)) {
            markInvalid(input, 'Nomor telepon tidak valid');
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
        
        // Validasi saat input berubah
        input.addEventListener('input', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                // Hanya tampilkan pesan error jika field sudah pernah difokuskan
                if (this.classList.contains('visited')) {
                    markInvalid(this, 'Bidang ini wajib diisi');
                }
            } else if (this.type === 'email' && this.value.trim() && !isValidEmail(this.value)) {
                markInvalid(this, 'Email tidak valid');
            } else if (this.type === 'tel' && this.value.trim() && !isValidPhone(this.value)) {
                markInvalid(this, 'Nomor telepon tidak valid');
            } else {
                markValid(this);
            }
        });
        
        // Tandai field yang sudah dikunjungi
        input.addEventListener('blur', function() {
            this.classList.add('visited');
            
            if (this.hasAttribute('required') && !this.value.trim()) {
                markInvalid(this, 'Bidang ini wajib diisi');
            }
        });
    });
    
    // Scroll ke error pertama jika ada
    if (!isValid) {
        const firstError = form.querySelector('.invalid');
        if (firstError) {
            firstError.focus();
            
            // Scroll ke elemen dengan error
            const yOffset = -120; // Offset untuk navbar
            const y = firstError.getBoundingClientRect().top + window.pageYOffset + yOffset;
            
            window.scrollTo({
                top: y,
                behavior: 'smooth'
            });
        }
    }
    
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
    
    // Tambahkan ikon peringatan
    errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
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
    // Regex yang lebih ketat untuk validasi email
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
}

function isValidPhone(phone) {
    // Regex untuk validasi nomor telepon/WhatsApp Indonesia
    // Format yang diterima: +62xxx, 08xxx, 62xxx
    const regex = /^(\+62|62|0)[0-9]{8,15}$/;
    return regex.test(phone.replace(/[\s-]/g, ''));
}

// Tambahkan CSS tambahan menggunakan stylesheet dinamis
document.addEventListener('DOMContentLoaded', function() {
    // Style untuk elemen pada touch device
    const style = document.createElement('style');
    style.innerHTML = `
        /* Form validation styles */
        .invalid {
            border-color: var(--error) !important;
            box-shadow: 0 0 0 2px rgba(204, 51, 99, 0.2) !important;
        }
        
        .error-message {
            color: var(--error);
            font-size: 0.85em;
            margin-top: 5px;
            display: flex;
            align-items: center;
            gap: 4px;
            animation: fadeIn 0.3s ease;
        }
        
        .error-message i {
            font-size: 0.9em;
        }
        
        /* Touch device optimizations */
        .touch-device .touch-target {
            min-width: 44px;
            min-height: 44px;
        }
        
        .touch-device .touch-hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-lg);
        }
        
        /* Reduced motion preferences */
        @media (prefers-reduced-motion: reduce), 
        .reduced-motion {
            * {
                animation-duration: 0.001s !important;
                transition-duration: 0.001s !important;
                scroll-behavior: auto !important;
            }
        }
        
        /* Preload animation untuk slider */
        .testimonial-slide.preload {
            display: none;
            position: absolute;
            left: 9999px;
        }
        
        /* Loading styles */
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .fa-spinner {
            animation: spin 1s infinite linear;
        }
        
        /* Image lazy load animation */
        img.loaded {
            animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        /* Fix input zoom on mobile */
        @media (max-width: 768px) {
            input, select, textarea {
                font-size: 16px !important;
            }
        }
        
        /* Animate form transitions */
        #contactForm, #formSuccess {
            transition: opacity 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    
    // Tambahkan delay berbeda untuk setiap service card
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        // Batas maksimal delay untuk performa yang lebih baik di mobile
        const delay = Math.min(index, 5) * 0.1;
        card.style.setProperty('--i', delay);
    });
    
    // Tambahkan lazy loading attribute ke semua gambar 
    // (kecuali above-the-fold images)
    document.querySelectorAll('img:not(.critical-image)').forEach(img => {
        if (!img.hasAttribute('data-src') && img.src) {
            img.setAttribute('data-src', img.src);
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
            img.classList.add('lazy');
        }
    });
    
    // Inisialisasi lazy loading
    initLazyLoading();
});
