// Initialize AOS Animation
AOS.init({
    duration: 1000,
    once: true
});

// Dynamic Guest Name from URL parameters (?to=Nama+Tamu)
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    const guestNameElement = document.getElementById('guest-name');
    
    if (guestName) {
        guestNameElement.textContent = decodeURIComponent(guestName);
        document.getElementById('rsvp-name').value = decodeURIComponent(guestName);
        document.getElementById('gb-name').value = decodeURIComponent(guestName);
    } else {
        guestNameElement.textContent = "Bapak/Ibu/Saudara/i";
    }

    // Inisialisasi Efek 3D Parallax Mouse Motion & Falling Petals Canvas
    init3DStickerParallax();
    initPetalCanvas();
});

/* -------------------------------------------------------------
   3D MOTION & PARALLAX EFFECT UNTUK STICKER BUNGA WELCOME SCREEN
---------------------------------------------------------------- */
function init3DStickerParallax() {
    const cover = document.getElementById('cover');
    const card = document.getElementById('welcome-card');
    const stickers = document.querySelectorAll('.sticker-element');

    if (!cover || !card) return;

    cover.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        // Calculate offset values (-0.5 to 0.5)
        const x = (clientX / innerWidth) - 0.5;
        const y = (clientY / innerHeight) - 0.5;

        // 3D Tilt Card Effect
        card.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(10px)`;

        // Parallax Floating Stickers Effect
        stickers.forEach((sticker) => {
            const depth = parseFloat(sticker.getAttribute('data-depth')) || 0.05;
            const moveX = x * depth * 300;
            const moveY = y * depth * 300;
            sticker.style.transform = `translate3d(${moveX}px, ${moveY}px, 0px) rotate(${moveX * 0.05}deg)`;
        });
    });

    // Reset position on mouse leave
    cover.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)`;
        stickers.forEach((sticker) => {
            sticker.style.transform = `translate3d(0px, 0px, 0px)`;
        });
    });
}

/* -------------------------------------------------------------
   CANVAS ANIMATION: KELOPAK BUNGA GUGUR (PETAL FALL ANIMATION)
---------------------------------------------------------------- */
function initPetalCanvas() {
    const canvas = document.getElementById('cover-petal-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const numPetals = 25;
    const petals = [];

    // Color Palette: White & Soft Blue tones
    const colors = ['rgba(255, 255, 255, 0.7)', 'rgba(186, 230, 253, 0.8)', 'rgba(147, 197, 253, 0.6)'];

    for (let i = 0; i < numPetals; i++) {
        petals.push({
            x: Math.random() * width,
            y: Math.random() * height - height,
            size: Math.random() * 8 + 6,
            speedY: Math.random() * 1.2 + 0.8,
            speedX: Math.random() * 0.8 - 0.4,
            rotation: Math.random() * 360,
            rotSpeed: Math.random() * 1 - 0.5,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    function drawPetal(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size, -p.size / 2, p.size, p.size / 2, 0, p.size);
        ctx.bezierCurveTo(-p.size, p.size / 2, -p.size, -p.size / 2, 0, -p.size);
        ctx.fill();

        ctx.restore();
    }

    function update() {
        ctx.clearRect(0, 0, width, height);

        petals.forEach((p) => {
            p.y += p.speedY;
            p.x += Math.sin(p.y * 0.01) + p.speedX;
            p.rotation += p.rotSpeed;

            if (p.y > height + 20) {
                p.y = -20;
                p.x = Math.random() * width;
            }

            drawPetal(p);
        });

        requestAnimationFrame(update);
    }

    update();
}

/* -------------------------------------------------------------
   OPEN INVITATION & AUDIO CONTROLS
---------------------------------------------------------------- */
const cover = document.getElementById('cover');
const mainContent = document.getElementById('main-content');
const floatingControls = document.getElementById('floating-controls');
const openBtn = document.getElementById('open-invitation');
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
const musicIcon = document.getElementById('music-icon');

let isPlaying = false;

openBtn.addEventListener('click', () => {
    cover.style.opacity = '0';
    cover.style.transform = 'scale(1.05)';
    setTimeout(() => {
        cover.style.display = 'none';
        mainContent.style.opacity = '1';
        floatingControls.style.display = 'flex';
        
        // Play Audio
        bgMusic.play().then(() => {
            isPlaying = true;
            musicIcon.classList.remove('fa-music');
            musicIcon.classList.add('fa-compact-disc', 'fa-spin');
        }).catch(err => {
            console.log("Audio autoplay restricted:", err);
        });
    }, 1000);
});

// Music Toggle Handler
musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        isPlaying = false;
        musicIcon.classList.remove('fa-compact-disc', 'fa-spin');
        musicIcon.classList.add('fa-music');
    } else {
        bgMusic.play();
        isPlaying = true;
        musicIcon.classList.remove('fa-music');
        musicIcon.classList.add('fa-compact-disc', 'fa-spin');
    }
});

/* -------------------------------------------------------------
   COUNTDOWN TIMER
---------------------------------------------------------------- */
const weddingDate = new Date("November 15, 2026 08:00:00").getTime();

const timer = setInterval(() => {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
        clearInterval(timer);
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = String(days).padStart(2, '0');
    document.getElementById('hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
}, 1000);

/* -------------------------------------------------------------
   RSVP & GUESTBOOK HANDLERS
---------------------------------------------------------------- */
document.getElementById('rsvp-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('rsvp-name').value;
    const status = document.getElementById('rsvp-status').value;
    const jumlah = document.getElementById('rsvp-jumlah').value;
    
    alert(`Terima kasih ${name}, konfirmasi kehadiran Anda (${status}, ${jumlah} orang) berhasil dikirim!`);
    e.target.reset();
});

document.getElementById('guestbook-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('gb-name').value;
    const message = document.getElementById('gb-message').value;
    
    const container = document.getElementById('comments-container');
    const newComment = document.createElement('div');
    newComment.className = "bg-slate-900 p-6 rounded-2xl border border-slate-800 animate-fade-in";
    newComment.innerHTML = `
        <div class="flex justify-between items-center mb-2">
            <h4 class="font-bold text-sky-200">${name}</h4>
            <span class="text-xs text-slate-500">Baru saja</span>
        </div>
        <p class="text-slate-300 text-sm">${message}</p>
    `;
    
    container.prepend(newComment);
    e.target.reset();
    alert("Ucapan dan doa berhasil dikirim!");
});