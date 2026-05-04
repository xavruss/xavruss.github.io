let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const sliderTrack = document.getElementById('sliderTrack');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const dotsContainer = document.getElementById('dotsIndicator');

// Initialize dots
function initDots() {
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dotsContainer.appendChild(dot);
    }
}

function updateUI() {
    // Move track
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update active slide class for image zoom effect
    slides.forEach((slide, index) => {
        if (index === currentSlide) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });

    // Update dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    // Update buttons
    if (currentSlide === 0) {
        btnPrev.disabled = true;
    } else {
        btnPrev.disabled = false;
    }

    if (currentSlide === totalSlides - 1) {
        btnNext.style.display = 'none';
        btnPrev.style.display = 'none';
        dotsContainer.style.display = 'none';
    } else {
        btnNext.style.display = 'flex';
        btnPrev.style.display = 'flex';
        dotsContainer.style.display = 'flex';
        
        // Change text on last step before success
        if (currentSlide === totalSlides - 2) {
            btnNext.innerHTML = 'Finalizar <i class="ri-check-line"></i>';
            btnNext.classList.add('bg-green');
        } else {
            btnNext.innerHTML = 'Siguiente <i class="ri-arrow-right-s-line"></i>';
            btnNext.classList.remove('bg-green');
        }
    }
}

function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateUI();
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        updateUI();
    }
}

function goToSlide(index) {
    currentSlide = index;
    updateUI();
}

// Touch events for swipe
let touchStartX = 0;
let touchEndX = 0;

sliderTrack.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

sliderTrack.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50; // minimum distance to be considered a swipe
    if (touchStartX - touchEndX > swipeThreshold) {
        // Swipe left -> Next
        nextSlide();
    }
    if (touchEndX - touchStartX > swipeThreshold) {
        // Swipe right -> Prev
        prevSlide();
    }
}

// Initialize
initDots();
updateUI();
