// Initialize AOS Animation
AOS.init({
    duration: 1000,
    once: true
});

// Dynamic Guest Name from URL parameters
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
});

// Open Invitation Cover Handler
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

// Countdown Timer
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

// RSVP Form Submission Handler
document.getElementById('rsvp-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('rsvp-name').value;
    const status = document.getElementById('rsvp-status').value;
    const jumlah = document.getElementById('rsvp-jumlah').value;
    
    alert(`Terima kasih ${name}, konfirmasi kehadiran Anda (${status}, ${jumlah} orang) berhasil dikirim!`);
    e.target.reset();
});

// Guestbook Form Submission Handler
document.getElementById('guestbook-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('gb-name').value;
    const message = document.getElementById('gb-message').value;
    
    const container = document.getElementById('comments-container');
    const newComment = document.createElement('div');
    newComment.className = "bg-stone-950 p-6 rounded-2xl border border-stone-800 animate-fade-in";
    newComment.innerHTML = `
        <div class="flex justify-between items-center mb-2">
            <h4 class="font-bold text-amber-200">${name}</h4>
            <span class="text-xs text-stone-500">Baru saja</span>
        </div>
        <p class="text-stone-300 text-sm">${message}</p>
    `;
    
    container.prepend(newComment);
    e.target.reset();
    alert("Ucapan dan doa berhasil dikirim!");
});
