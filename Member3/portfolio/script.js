// Typing effect for exactly what user is
const rolesByLang = {
    en: ["Backend Developer", "Web Developer", "Game Developer"],
    th: ["นักพัฒนาแบ็กเอนด์", "นักพัฒนาเว็บ", "นักพัฒนาเกม"]
};
let currentLang = localStorage.getItem('portfolioLang') || 'en';
const roles = rolesByLang[currentLang];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 2000;

document.addEventListener("DOMContentLoaded", () => {
    const roleSpan = document.querySelector(".typing-text");

    function type() {
        if (!roleSpan) return;
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            roleSpan.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            roleSpan.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? erasingDelay : typingDelay;

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = newTextDelay;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex++;
            if (roleIndex >= roles.length) {
                roleIndex = 0;
            }
        }

        setTimeout(type, typeSpeed);
    }

    if (roleSpan) {
        setTimeout(type, newTextDelay / 2);
    }

    // Scroll Reveal Animation
    function reveal() {
        const reveals = document.querySelectorAll(".reveal, .reveal-right");
        for (let i = 0; i < reveals.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = reveals[i].getBoundingClientRect().top;
            const elementVisible = 100;

            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add("active");
            }
        }
    }

    window.addEventListener("scroll", reveal);
    reveal(); // Trigger on load

    // Mobile Navigation Toggle
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });

        // Close menu when clicking a link
        document.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
            });
        });
    }

    // Language Toggle Logic
    const langToggle = document.getElementById('langToggle');
    const langOptEN = document.getElementById('langOptEN');
    const langOptTH = document.getElementById('langOptTH');

    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('portfolioLang', lang);
        document.body.classList.remove('lang-en', 'lang-th');
        document.body.classList.add('lang-' + lang);
        document.documentElement.lang = lang === 'th' ? 'th' : 'en';
        langOptEN.classList.toggle('active', lang === 'en');
        langOptTH.classList.toggle('active', lang === 'th');
        // Update typing text language
        roleIndex = 0;
        charIndex = 0;
        isDeleting = false;
        const roleSpan = document.querySelector('.typing-text');
        if (roleSpan) roleSpan.textContent = '';
        Object.assign(roles, rolesByLang[lang]);
        roles.length = rolesByLang[lang].length;
    }

    // Apply saved language on load
    applyLanguage(currentLang);

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            applyLanguage(currentLang === 'en' ? 'th' : 'en');
        });
    }

    // Click-to-open modal preview images for certifications, events, and project highlights
    const imageModal = document.getElementById('imageModal');
    const imageModalImage = document.getElementById('imageModalImage');
    const imageModalCaption = document.getElementById('imageModalCaption');
    const imageModalClose = document.querySelector('.image-modal-close');
    const imageModalPrev = document.getElementById('imageModalPrev');
    const imageModalNext = document.getElementById('imageModalNext');

    let activeGallery = [];
    let activeGalleryIndex = 0;

    function getImageSources(item) {
        const imagesFromAttr = item.getAttribute('data-images');
        if (imagesFromAttr) {
            return imagesFromAttr.split(',').map(src => src.trim()).filter(Boolean);
        }

        const singleImage = item.getAttribute('data-image');
        return singleImage ? [singleImage] : [];
    }

    function setModalContent(images, title, altText, startIndex = 0) {
        activeGallery = images;
        activeGalleryIndex = startIndex;

        if (!images.length) return;

        imageModalImage.src = images[startIndex];
        imageModalImage.alt = altText || title || '';
        imageModalCaption.textContent = title || '';

        if (images.length > 1) {
            imageModalPrev.style.display = 'flex';
            imageModalNext.style.display = 'flex';
        } else {
            imageModalPrev.style.display = 'none';
            imageModalNext.style.display = 'none';
        }
    }

    function openImageModal(item) {
        const images = getImageSources(item);
        if (!images.length) return;

        const title = item.getAttribute('data-title') || item.textContent.trim() || 'Preview';
        const altText = item.getAttribute('data-alt') || '';

        setModalContent(images, title, altText, 0);
        imageModal.classList.add('open');
        imageModal.setAttribute('aria-hidden', 'false');
    }

    function showNextImage(direction) {
        if (!activeGallery.length) return;
        activeGalleryIndex = (activeGalleryIndex + direction + activeGallery.length) % activeGallery.length;
        imageModalImage.src = activeGallery[activeGalleryIndex];
    }

    document.querySelectorAll('.clickable-item').forEach(item => {
        const images = getImageSources(item);
        if (!images.length) return;

        const previewImage = document.createElement('img');
        previewImage.className = 'preview-image';
        previewImage.src = images[0];
        previewImage.alt = item.getAttribute('data-alt') || '';
        item.appendChild(previewImage);

        item.addEventListener('click', (event) => {
            if (event.target.closest('a')) return;
            openImageModal(item);
        });
    });

    function closeImageModal() {
        imageModal.classList.remove('open');
        imageModal.setAttribute('aria-hidden', 'true');
    }

    if (imageModalClose) {
        imageModalClose.addEventListener('click', closeImageModal);
    }

    if (imageModalPrev) {
        imageModalPrev.addEventListener('click', () => showNextImage(-1));
    }

    if (imageModalNext) {
        imageModalNext.addEventListener('click', () => showNextImage(1));
    }

    if (imageModal) {
        imageModal.addEventListener('click', (event) => {
            if (event.target === imageModal || event.target.classList.contains('image-modal-backdrop')) {
                closeImageModal();
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeImageModal();
        }
    });

    // Project Filter Logic
    const filterBtns = document.querySelectorAll(".filter-btn");
    const projectItems = document.querySelectorAll(".project-item");

    if (filterBtns.length > 0 && projectItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const filterValue = btn.getAttribute("data-filter");

                projectItems.forEach(item => {
                    if (filterValue === "all" || item.getAttribute("data-category") === filterValue) {
                        item.classList.remove("hide");
                    } else {
                        item.classList.add("hide");
                    }
                });
            });
        });
    }

    // Event carousel logic
    const eventSlides = Array.from(document.querySelectorAll('.event-slide'));
    const eventsPrev = document.getElementById('eventsPrev');
    const eventsNext = document.getElementById('eventsNext');
    let eventSlideIndex = 0;
    let visibleSlides = 3;

    function getVisibleSlides() {
        if (window.innerWidth <= 960) return 1;
        return 2;
    }

    function clampEventIndex(index) {
        return Math.min(Math.max(index, 0), Math.max(0, eventSlides.length - visibleSlides));
    }

    function updateEventCarousel() {
        eventSlides.forEach((slide, index) => {
            slide.classList.toggle('hidden', index < eventSlideIndex || index >= eventSlideIndex + visibleSlides);
        });

        if (eventsPrev) {
            eventsPrev.disabled = eventSlideIndex === 0;
        }
        if (eventsNext) {
            eventsNext.disabled = eventSlideIndex >= eventSlides.length - visibleSlides;
        }
    }

    function showEventSlide(direction) {
        if (!eventSlides.length) return;
        eventSlideIndex = clampEventIndex(eventSlideIndex + direction);
        updateEventCarousel();
    }

    function refreshEventCarousel() {
        visibleSlides = getVisibleSlides();
        eventSlideIndex = clampEventIndex(eventSlideIndex);
        updateEventCarousel();
    }

    if (eventsPrev) {
        eventsPrev.addEventListener('click', () => showEventSlide(-1));
    }

    if (eventsNext) {
        eventsNext.addEventListener('click', () => showEventSlide(1));
    }

    window.addEventListener('resize', refreshEventCarousel);
    refreshEventCarousel();
});
