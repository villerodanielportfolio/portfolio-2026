// --- 1. MENU SCROLL SPY ---
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.menu-link');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`.menu-link[href="#${entry.target.id}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });
}, { threshold: 0.5 });

sections.forEach(sec => sectionObserver.observe(sec));


// --- 2. PORTFOLIO EXIT LOGIC (LEFT PANEL) ---
const leftPanel = document.getElementById('leftPanel');
let scrollCooldown = false;

leftPanel.addEventListener('wheel', (e) => {
    if (scrollCooldown) return;

    const currentIndex = getCurrentIndex();

    if (e.deltaY < 0 && currentIndex === 0) {
        document.getElementById('education').scrollIntoView({ behavior: 'smooth' });
        activateCooldown();
    } else if (e.deltaY > 0 && currentIndex === cards.length - 1) {
        document.getElementById('skills').scrollIntoView({ behavior: 'smooth' });
        activateCooldown();
    }
});

function activateCooldown() {
    scrollCooldown = true;
    setTimeout(() => { scrollCooldown = false; }, 800);
}


// --- 3. GALLERY LOGIC ---
const cards = document.querySelectorAll('.experience-card');
const galleries = document.querySelectorAll('.gallery-container');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const bgBlurLayer = document.getElementById('bgBlurLayer');
const galleryImages = document.querySelectorAll('.gallery-img');
const galleryVideos = document.querySelectorAll('.gallery-video');
const modalOverlay = document.getElementById('modalOverlay');
const closeModal = document.getElementById('closeModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');

let activeGallery = null;

cards.forEach(card => {
    card.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A') {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            cards.forEach(c => c.classList.remove('active'));
            entry.target.classList.add('active');
            switchGallery(entry.target.getAttribute('data-target'));
        }
    });
}, { root: leftPanel, rootMargin: '-45% 0px -45% 0px', threshold: 0 });

cards.forEach(card => observer.observe(card));

function switchGallery(id) {
    galleries.forEach(g => {
        if (g.id === id) {
            g.classList.add('active');
            g.scrollLeft = 0;
            activeGallery = g;
        } else {
            g.classList.remove('active');
        }
    });
    checkArrows();
}

galleries.forEach(gallery => {
    gallery.addEventListener('wheel', (evt) => {
        if (scrollCooldown) return;

        const scrollLeft = gallery.scrollLeft;
        const maxScroll = gallery.scrollWidth - gallery.clientWidth;
        const currentIndex = getCurrentIndex();

        if (currentIndex === 0 && scrollLeft <= 2 && evt.deltaY < 0) {
            document.getElementById('education').scrollIntoView({ behavior: 'smooth' });
            activateCooldown();
            return;
        }

        if (currentIndex === cards.length - 1 && scrollLeft >= maxScroll - 2 && evt.deltaY > 0) {
            document.getElementById('skills').scrollIntoView({ behavior: 'smooth' });
            activateCooldown();
            return;
        }

        if (evt.deltaY !== 0) {
            evt.preventDefault();
            gallery.scrollLeft += evt.deltaY * 4;
            checkArrows();
        }
    });

    gallery.addEventListener('scroll', checkArrows);
});

function checkArrows() {
    if (!activeGallery) return;
    const scrollLeft = activeGallery.scrollLeft;
    const maxScroll = activeGallery.scrollWidth - activeGallery.clientWidth;
    const currentIndex = getCurrentIndex();

    prevBtn.classList.toggle('visible', scrollLeft <= 5 && currentIndex > 0);
    nextBtn.classList.toggle('visible', scrollLeft >= maxScroll - 5 && currentIndex < cards.length - 1);
}

function getCurrentIndex() {
    return Array.from(cards).findIndex(card => card.classList.contains('active'));
}

prevBtn.addEventListener('click', () => {
    const index = getCurrentIndex();
    if (index > 0) cards[index - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
});

nextBtn.addEventListener('click', () => {
    const index = getCurrentIndex();
    if (index < cards.length - 1) cards[index + 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
});

galleryImages.forEach(img => {
    img.addEventListener('mouseenter', () => {
        bgBlurLayer.style.backgroundImage = `url('${img.getAttribute('src')}')`;
        bgBlurLayer.classList.add('visible');
    });
    img.addEventListener('mouseleave', () => {
        bgBlurLayer.classList.remove('visible');
    });
    img.addEventListener('click', () => {
        modalImg.src = img.getAttribute('src');
        modalTitle.textContent = img.getAttribute('data-title') || 'Project Detail';
        modalDesc.textContent = img.getAttribute('data-desc') || 'No description available.';
        modalOverlay.classList.add('active');
    });
});

galleryVideos.forEach(video => {
    video.addEventListener('mouseleave', () => {
        bgBlurLayer.classList.remove('visible');
    });
    video.addEventListener('click', () => {
        modalVideo.src = video.getAttribute('src');
        videoModalTitle.textContent = video.getAttribute('data-title') || 'Video';
        videoModalOverlay.classList.add('active');
        modalVideo.muted = false;
        modalVideo.load();
        const onCanPlay = () => {
            modalVideo.removeEventListener('canplay', onCanPlay);
            modalVideo.currentTime = 0;
            modalVideo.play().catch(() => {});
            syncPlayBtn();
            syncMuteBtn();
        };
        modalVideo.addEventListener('canplay', onCanPlay);
    });
});

function hideModal() { modalOverlay.classList.remove('active'); }
closeModal.addEventListener('click', hideModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) hideModal();
});

// --- VIDEO MODAL ---
const videoModalOverlay = document.getElementById('videoModalOverlay');
const closeVideoModalBtn = document.getElementById('closeVideoModal');
const modalVideo = document.getElementById('modalVideo');
const videoModalTitle = document.getElementById('videoModalTitle');
const vcPlay = document.getElementById('vcPlay');
const vcBack = document.getElementById('vcBack');
const vcFwd = document.getElementById('vcFwd');
const vcMute = document.getElementById('vcMute');

function syncPlayBtn() {
    vcPlay.querySelector('.icon-play').style.display  = modalVideo.paused ? 'block' : 'none';
    vcPlay.querySelector('.icon-pause').style.display = modalVideo.paused ? 'none'  : 'block';
}

function syncMuteBtn() {
    vcMute.querySelector('.icon-vol-on').style.display  = modalVideo.muted ? 'none'  : 'block';
    vcMute.querySelector('.icon-vol-off').style.display = modalVideo.muted ? 'block' : 'none';
}

modalVideo.addEventListener('play',  syncPlayBtn);
modalVideo.addEventListener('pause', syncPlayBtn);

vcPlay.addEventListener('click', () => {
    if (modalVideo.paused) modalVideo.play(); else modalVideo.pause();
});

vcBack.addEventListener('click', () => {
    modalVideo.currentTime = Math.max(0, modalVideo.currentTime - 10);
});

vcFwd.addEventListener('click', () => {
    modalVideo.currentTime = Math.min(modalVideo.duration || Infinity, modalVideo.currentTime + 10);
});

vcMute.addEventListener('click', () => {
    modalVideo.muted = !modalVideo.muted;
    syncMuteBtn();
});

function hideVideoModal() {
    videoModalOverlay.classList.remove('active');
    modalVideo.pause();
    modalVideo.src = '';
}

closeVideoModalBtn.addEventListener('click', hideVideoModal);
videoModalOverlay.addEventListener('click', (e) => {
    if (e.target === videoModalOverlay) hideVideoModal();
});

document.addEventListener('keydown', (e) => {
    if (videoModalOverlay.classList.contains('active')) {
        if (e.code === 'Space')      { e.preventDefault(); vcPlay.click(); }
        if (e.code === 'ArrowLeft')  vcBack.click();
        if (e.code === 'ArrowRight') vcFwd.click();
        if (e.code === 'Escape')     hideVideoModal();
    }
    if (ytModalOverlay.classList.contains('active')) {
        if (e.code === 'Escape') hideYtModal();
    }
});

// --- YOUTUBE MODAL ---
const ytModalOverlay  = document.getElementById('ytModalOverlay');
const closeYtModalBtn = document.getElementById('closeYtModal');
const ytIframe        = document.getElementById('ytIframe');
const ytModalTitle    = document.getElementById('ytModalTitle');

document.querySelectorAll('.gallery-yt-item').forEach(item => {
    item.addEventListener('click', () => {
        const ytId = item.getAttribute('data-youtube');
        ytIframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1`;
        ytModalTitle.textContent = item.getAttribute('data-title') || 'Video';
        ytModalOverlay.classList.add('active');
    });
});

function hideYtModal() {
    ytModalOverlay.classList.remove('active');
    ytIframe.src = '';
}

closeYtModalBtn.addEventListener('click', hideYtModal);
ytModalOverlay.addEventListener('click', (e) => {
    if (e.target === ytModalOverlay) hideYtModal();
});


// --- 3b. BACKGROUND PARALLAX ON HOVER ---
const rightPanel = document.querySelector('.right-panel');

let plxTarget  = { x: 50, y: 50 };
let plxCurrent = { x: 50, y: 50 };
let plxRafId   = null;

function lerp(a, b, t) { return a + (b - a) * t; }

function parallaxTick() {
    plxCurrent.x = lerp(plxCurrent.x, plxTarget.x, 0.07);
    plxCurrent.y = lerp(plxCurrent.y, plxTarget.y, 0.07);

    bgBlurLayer.style.backgroundPosition = `${plxCurrent.x}% ${plxCurrent.y}%`;

    // Keep looping until current is close enough to target
    const dx = Math.abs(plxCurrent.x - plxTarget.x);
    const dy = Math.abs(plxCurrent.y - plxTarget.y);
    if (dx > 0.05 || dy > 0.05) {
        plxRafId = requestAnimationFrame(parallaxTick);
    } else {
        plxRafId = null;
    }
}

function startParallaxRaf() {
    if (!plxRafId) plxRafId = requestAnimationFrame(parallaxTick);
}

rightPanel.addEventListener('mousemove', (e) => {
    if (!bgBlurLayer.classList.contains('visible')) return;

    const rect = rightPanel.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;

    plxTarget.x = 50 + x * -30;
    plxTarget.y = 50 + y * -30;
    startParallaxRaf();
});

rightPanel.addEventListener('mouseleave', () => {
    plxTarget.x = 50;
    plxTarget.y = 50;
    startParallaxRaf(); // glide back to center
});


// --- 4. EDUCATION CAROUSEL ---
const eduSlides = document.querySelectorAll('.edu-slide');
const eduBtns = document.querySelectorAll('.edu-btn');
const CAROUSEL_DURATION = 5000;
let eduCurrentIndex = 0;
let eduElapsed = 0;        // accumulated ms on current slide
let eduLastTimestamp = null;
let eduAnimFrame = null;
let eduPausedByBtn = -1;   // index of the button that paused the animation (-1 = not paused)

function eduGoTo(index) {
    eduBtns[eduCurrentIndex].querySelector('.edu-progress-fill').style.width = '0%';
    eduSlides[eduCurrentIndex].classList.remove('active');
    eduBtns[eduCurrentIndex].classList.remove('active');

    eduCurrentIndex = index;
    eduElapsed = 0;
    eduPausedByBtn = -1;

    eduSlides[index].classList.add('active');
    eduBtns[index].classList.add('active');

    cancelAnimationFrame(eduAnimFrame);
    eduLastTimestamp = null;
    eduAnimFrame = requestAnimationFrame(eduTick);
}

function eduTick(timestamp) {
    if (eduLastTimestamp !== null) eduElapsed += timestamp - eduLastTimestamp;
    eduLastTimestamp = timestamp;

    const progress = Math.min(eduElapsed / CAROUSEL_DURATION, 1);
    eduBtns[eduCurrentIndex].querySelector('.edu-progress-fill').style.width = `${progress * 100}%`;

    if (progress >= 1) {
        eduGoTo((eduCurrentIndex + 1) % eduSlides.length);
        return;
    }

    eduAnimFrame = requestAnimationFrame(eduTick);
}

eduBtns.forEach(btn => {
    const index = parseInt(btn.dataset.index);

    btn.addEventListener('click', () => {
        if (index !== eduCurrentIndex) eduGoTo(index);
        // Pause: freeze the progress bar on click
        cancelAnimationFrame(eduAnimFrame);
        eduPausedByBtn = eduCurrentIndex;
        eduLastTimestamp = null;
    });

    btn.addEventListener('mouseleave', () => {
        // Resume only when leaving the button that triggered the pause
        if (eduPausedByBtn === index) {
            eduPausedByBtn = -1;
            eduLastTimestamp = null;
            eduAnimFrame = requestAnimationFrame(eduTick);
        }
    });
});

eduAnimFrame = requestAnimationFrame(eduTick);


// --- 5. LOGO CAROUSEL (SKILLS) ---
(function initLogoCarousel() {
    const D = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';

    // InDesign SVG inline (not on any public CDN)
    const idSvg = `data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext y='.9em' font-size='90' font-family='Georgia%2C serif' font-weight='700' fill='%23FF3366'%3EId%3C/text%3E%3C/svg%3E`;

    // Inline SVGs for tools not on any public CDN
    const geminiSvg = `data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 5 C50 38 63 50 95 50 C63 50 50 63 50 95 C50 63 37 50 5 50 C37 50 50 37 50 5Z' fill='%234285F4'/%3E%3C/svg%3E`;
    const mjSvg     = `data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext y='.85em' font-size='66' font-family='Arial%2C sans-serif' font-weight='900' fill='%23C4A882'%3EMJ%3C/text%3E%3C/svg%3E`;
    const veoSvg    = `data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50' y='65' text-anchor='middle' font-size='38' font-family='Arial%2C sans-serif' font-weight='700' fill='%23EA4335'%3EVeo3%3C/text%3E%3C/svg%3E`;
    const nbSvg     = `data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50' y='72' text-anchor='middle' font-size='66' font-family='Georgia%2C serif' font-weight='700' fill='%23FFD700'%3ENb%3C/text%3E%3C/svg%3E`;

    const logoData = [
        { name: 'Figma',        src: `${D}/figma/figma-original.svg`,             hex: 'F24E1E' },  // [0]
        { name: 'Illustrator',  src: `${D}/illustrator/illustrator-plain.svg`,    hex: 'FF9A00' },  // [1]
        { name: 'Photoshop',    src: `${D}/photoshop/photoshop-plain.svg`,         hex: '31A8FF' },  // [2]
        { name: 'WordPress',    src: `${D}/wordpress/wordpress-plain.svg`,         hex: '21759B' },  // [3]
        { name: 'Webflow',      src: `${D}/webflow/webflow-original.svg`,          hex: '4353FF' },  // [4]
        { name: 'Premiere Pro', src: `${D}/premierepro/premierepro-plain.svg`,     hex: '9999FF' },  // [5]
        { name: 'InDesign',     src: idSvg,                                        hex: 'FF3366' },  // [6]
        { name: 'HTML5',        src: `${D}/html5/html5-plain.svg`,                 hex: 'E34F26' },  // [7]
        { name: 'CSS3',         src: `${D}/css3/css3-plain.svg`,                   hex: '1572B6' },  // [8]
        { name: 'Gemini',       src: geminiSvg,                                    hex: '4285F4' },  // [9]
        { name: 'NanoBanana',   src: nbSvg,                                        hex: 'FFD700' },  // [10]
        { name: 'Veo3',         src: veoSvg,                                       hex: 'EA4335' },  // [11]
        { name: 'Midjourney',   src: mjSvg,                                        hex: 'C4A882' },  // [12]
    ];

    // 3 columns — grouped thematically
    const columns = [
        [logoData[5], logoData[0], logoData[9],  logoData[12], logoData[11]], // Creative/AI:  Premiere Pro · Figma · Gemini · Midjourney · Veo3
        [logoData[1], logoData[2], logoData[6],  logoData[10]],               // Adobe Suite:  Illustrator · Photoshop · InDesign · NanoBanana
        [logoData[4], logoData[3], logoData[7],  logoData[8]],                // Web tech:     Webflow · WordPress · HTML5 · CSS3
    ];

    const colEls = document.querySelectorAll('.carousel-col');
    if (!colEls.length) return;

    const currentIndexes = [0, 0, 0];

    function hexToRgb(hex) {
        return [
            parseInt(hex.slice(0, 2), 16),
            parseInt(hex.slice(2, 4), 16),
            parseInt(hex.slice(4, 6), 16)
        ].join(', ');
    }

    function makeCard(logo) {
        const rgb = hexToRgb(logo.hex);
        const card = document.createElement('div');
        card.className = 'logo-card';
        card.style.cssText = `
            background: rgba(${rgb}, 0.1);
            border: 1px solid rgba(${rgb}, 0.28);
            box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 24px rgba(${rgb}, 0.15);
        `;
        card.innerHTML = `
            <img src="${logo.src}"
                 alt="${logo.name}"
                 style="filter: drop-shadow(0 0 10px rgba(${rgb}, 0.55));">
            <span class="logo-card-name">${logo.name}</span>
        `;
        return card;
    }

    // Seed each column with its first logo
    colEls.forEach((col, i) => {
        const card = makeCard(columns[i][0]);
        col.appendChild(card);
        requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('visible')));
    });

    function cycleCol(colIndex) {
        const col = colEls[colIndex];
        const colLogos = columns[colIndex];
        const oldCard = col.querySelector('.logo-card');

        currentIndexes[colIndex] = (currentIndexes[colIndex] + 1) % colLogos.length;
        const newCard = makeCard(colLogos[currentIndexes[colIndex]]);
        col.appendChild(newCard);

        // Exit old card upward
        if (oldCard) {
            oldCard.classList.add('exiting');
            oldCard.classList.remove('visible');
            setTimeout(() => oldCard.remove(), 400);
        }

        // Enter new card from below
        requestAnimationFrame(() => requestAnimationFrame(() => newCard.classList.add('visible')));
    }

    const INTERVAL = 2200;
    const STAGGER  = 380;

    colEls.forEach((col, i) => {
        setTimeout(() => setInterval(() => cycleCol(i), INTERVAL), i * STAGGER + INTERVAL);
    });
})();
