// --- URL WEB APP GOOGLE APPS SCRIPT ANDA ---
const SCRIPT_URL = "PASTE_URL_WEB_APP_GOOGLE_APPS_SCRIPT_DISINI";

AOS.init({ duration: 1000, once: true });

window.addEventListener('DOMContentLoaded', () => {
    // Tangkap Nama Tamu dari URL (?to=Nama+Tamu)
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    const guestNameElement = document.getElementById('guest-name');
    
    if (guestName) {
        const decodedName = decodeURIComponent(guestName);
        guestNameElement.textContent = decodedName;
        document.getElementById('rsvp-name').value = decodedName;
        document.getElementById('gb-name').value = decodedName;
    } else {
        guestNameElement.textContent = "Bapak/Ibu/Saudara/i";
    }

    init3DGyroAndParallax();
    initPetalCanvas();
    fetchWeddingData();
    fetchComments();
});

// Ambil Data Konten dari Google Sheets
async function fetchWeddingData() {
    if (SCRIPT_URL.includes("PASTE_URL")) return;
    try {
        const response = await fetch(`${SCRIPT_URL}?action=getData`);
        const result = await response.json();
        if (result.status === "success") {
            const d = result.data;
            document.getElementById('cover-couple-names').textContent = `${d.groom_name_short} & ${d.bride_name_short}`;
            document.getElementById('cover-wedding-date').textContent = d.wedding_date;
            document.getElementById('hero-couple-names').textContent = `${d.groom_name_short} & ${d.bride_name_short}`;
            document.getElementById('hero-wedding-date').textContent = d.wedding_date;
            
            document.getElementById('groom-name').textContent = d.groom_fullname;
            document.getElementById('groom-parents').textContent = `Putra dari ${d.groom_parents}`;
            if (d.groom_photo) document.getElementById('groom-img').src = d.groom_photo;

            document.getElementById('bride-name').textContent = d.bride_fullname;
            document.getElementById('bride-parents').textContent = `Putri dari ${d.bride_parents}`;
            if (d.bride_photo) document.getElementById('bride-img').src = d.bride_photo;

            document.getElementById('akad-date').innerHTML = `<i class="fa-regular fa-calendar-days text-ice-400 mr-2"></i> ${d.akad_date}`;
            document.getElementById('akad-time').innerHTML = `<i class="fa-regular fa-clock text-ice-400 mr-2"></i> ${d.akad_time}`;
            document.getElementById('akad-location').textContent = d.akad_location;
            document.getElementById('akad-map-btn').href = d.akad_map_link;

            document.getElementById('resepsi-date').innerHTML = `<i class="fa-regular fa-calendar-days text-ice-400 mr-2"></i> ${d.resepsi_date}`;
            document.getElementById('resepsi-time').innerHTML = `<i class="fa-regular fa-clock text-ice-400 mr-2"></i> ${d.resepsi_time}`;
            document.getElementById('resepsi-location').textContent = d.resepsi_location;
            document.getElementById('resepsi-map-btn').href = d.resepsi_map_link;

            document.getElementById('bank-name').textContent = d.bank_name;
            document.getElementById('bank-acc').textContent = d.bank_acc_number;
            document.getElementById('bank-owner').textContent = `a.n. ${d.bank_acc_holder}`;
            document.getElementById('footer-couple').textContent = `${d.groom_name_short} & ${d.bride_name_short}`;

            startCountdown(d.countdown_target);
        }
    } catch (e) { console.log("Gagal memuat data dari spreadsheet:", e); }
}

// Ambil Komentar/Buku Tamu dari Google Sheets
async function fetchComments() {
    if (SCRIPT_URL.includes("PASTE_URL")) return;
    try {
        const response = await fetch(`${SCRIPT_URL}?action=getComments`);
        const result = await response.json();
        if (result.status === "success") {
            const container = document.getElementById('comments-container');
            container.innerHTML = "";
            result.comments.forEach(c => {
                const div = document.createElement('div');
                div.className = "bg-slate-950 p-6 rounded-2xl border border-slate-800";
                div.innerHTML = `
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="font-bold text-ice-200">${escapeHtml(c.name)}</h4>
                        <span class="text-xs text-slate-500">${c.date}</span>
                    </div>
                    <p class="text-slate-300 text-sm">${escapeHtml(c.message)}</p>
                `;
                container.appendChild(div);
            });
        }
    } catch (e) { console.log("Gagal memuat komentar:", e); }
}

// 3D Parallax & Gyroscope Motion for Or1.png and Card
function init3DGyroAndParallax() {
    const cover = document.getElementById('cover');
    const card = document.getElementById('welcome-card');
    const layers = document.querySelectorAll('.gyro-layer');
    if (!cover || !card) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    // Mouse Move Event
    cover.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth) - 0.5;
        targetY = (e.clientY / window.innerHeight) - 0.5;
    });

    cover.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
    });

    // Device Orientation (Gyroscope) Event for Mobile
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (e) => {
            if (e.gamma !== null && e.beta !== null) {
                // gamma: left to right (-90 to 90)
                // beta: front to back (-180 to 180)
                targetX = Math.max(Math.min(e.gamma / 30, 0.5), -0.5);
                targetY = Math.max(Math.min((e.beta - 45) / 30, 0.5), -0.5);
            }
        });
    }

    // Smooth Animation Loop (Lerp)
    function animate() {
        currentX += (targetX - currentX) * 0.1;
        currentY += (targetY - currentY) * 0.1;

        // Tilt Card
        card.style.transform = `perspective(1000px) rotateY(${currentX * 12}deg) rotateX(${-currentY * 12}deg)`;

        // Parallax & Gyro shift on layers (Or1.png ornaments)
        layers.forEach(layer => {
            const depth = parseFloat(layer.getAttribute('data-depth')) || 0.05;
            const moveX = currentX * depth * 500;
            const moveY = currentY * depth * 500;
            layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0px)`;
        });

        requestAnimationFrame(animate);
    }
    animate();
}

function initPetalCanvas() {
    const canvas = document.getElementById('cover-petal-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth, h = canvas.height = window.innerHeight;
    window.addEventListener('resize', () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; });
    
    const petals = Array.from({length: 22}, () => ({
        x: Math.random() * w, y: Math.random() * h - h, size: Math.random() * 8 + 4,
        speedY: Math.random() * 0.8 + 0.4, speedX: Math.random() * 0.5 - 0.25, rot: Math.random() * 360
    }));

    function animatePetals() {
        ctx.clearRect(0, 0, w, h);
        petals.forEach(p => {
            p.y += p.speedY; p.x += p.speedX; p.rot += 0.8;
            if (p.y > h + 10) { p.y = -10; p.x = Math.random() * w; }
            ctx.save(); ctx.translate(p.x, p.y); ctx.rotate((p.rot * Math.PI) / 180);
            ctx.fillStyle = 'rgba(186, 218, 242, 0.8)';
            ctx.fillRect(0, 0, p.size, p.size);
            ctx.restore();
        });
        requestAnimationFrame(animatePetals);
    }
    animatePetals();
}

// Countdown
function startCountdown(dateString) {
    const target = new Date(dateString || "November 15, 2026 08:00:00").getTime();
    setInterval(() => {
        const now = new Date().getTime(), dist = target - now;
        if (dist < 0) return;
        document.getElementById('days').innerText = String(Math.floor(dist / (1000 * 60 * 60 * 24))).padStart(2, '0');
        document.getElementById('hours').innerText = String(Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
        document.getElementById('minutes').innerText = String(Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        document.getElementById('seconds').innerText = String(Math.floor((dist % (1000 * 60)) / 1000)).padStart(2, '0');
    }, 1000);
}

// Buka Undangan & Musik
const cover = document.getElementById('cover'), mainContent = document.getElementById('main-content'), floatingControls = document.getElementById('floating-controls'), bgMusic = document.getElementById('bg-music'), musicIcon = document.getElementById('music-icon');
let isPlaying = false;

document.getElementById('open-invitation').addEventListener('click', () => {
    cover.style.opacity = '0';
    setTimeout(() => {
        cover.style.display = 'none';
        mainContent.style.opacity = '1';
        floatingControls.style.display = 'flex';
        bgMusic.play().then(() => {
            isPlaying = true;
            musicIcon.classList.replace('fa-music', 'fa-compact-disc');
            musicIcon.classList.add('fa-spin');
        }).catch(e => console.log("Autoplay blocked"));
    }, 1000);
});

document.getElementById('music-toggle').addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause(); isPlaying = false;
        musicIcon.classList.replace('fa-compact-disc', 'fa-music'); musicIcon.classList.remove('fa-spin');
    } else {
        bgMusic.play(); isPlaying = true;
        musicIcon.classList.replace('fa-music', 'fa-compact-disc'); musicIcon.classList.add('fa-spin');
    }
});

// Submit RSVP ke Google Sheets
document.getElementById('rsvp-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('rsvp-submit-btn');
    btn.textContent = "Mengirim..."; btn.disabled = true;

    const data = {
        type: "rsvp",
        name: document.getElementById('rsvp-name').value,
        status: document.getElementById('rsvp-status').value,
        jumlah: document.getElementById('rsvp-jumlah').value
    };

    try {
        await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) });
        alert("Konfirmasi kehadiran berhasil dikirim!");
        e.target.reset();
    } catch (err) {
        alert("Terjadi kesalahan koneksi.");
    } finally {
        btn.textContent = "Kirim Konfirmasi"; btn.disabled = false;
    }
});

// Submit Ucapan Buku Tamu ke Google Sheets
document.getElementById('guestbook-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('gb-submit-btn');
    btn.textContent = "Mengirim..."; btn.disabled = true;

    const data = {
        type: "guestbook",
        name: document.getElementById('gb-name').value,
        message: document.getElementById('gb-message').value
    };

    try {
        await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) });
        alert("Ucapan berhasil dikirim!");
        e.target.reset();
        setTimeout(fetchComments, 1500);
    } catch (err) {
        asset = "Terjadi kesalahan koneksi.";
        alert("Terjadi kesalahan koneksi.");
    } finally {
        btn.textContent = "Kirim Ucapan"; btn.disabled = false;
    }
});

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
