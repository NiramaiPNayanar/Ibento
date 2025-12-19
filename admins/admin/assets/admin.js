/* ================= SAFETY HELPERS ================= */
const $ = (q) => document.querySelector(q);
const $$ = (q) => document.querySelectorAll(q);

/* ================= SLIDER ================= */

const slider = $("#slider");
const slides = $$(".slide");
const prevBtn = $(".nav-arrow.prev");
const nextBtn = $(".nav-arrow.next");

let autoPlayInterval;
let currentSlide = 0;
let isAnimating = false;
let mouseX = 0;
let mouseY = 0;
let slideDuration = 5000;

/* ---------- Parallax ---------- */
function updateParallax() {
  if (!slides[currentSlide]) return;

  const bg = slides[currentSlide].querySelector(".background-layer");
  const shapes = $$(".parallax-shape");

  if (bg) {
    bg.style.transform = `translate(${20 * mouseX}px, ${20 * mouseY}px)`;
  }

  shapes.forEach((s, i) => {
    const n = 15 * (i + 1);
    s.style.transform = `translate(${mouseX * n}px, ${mouseY * n}px)`;
  });
}

/* ---------- Slides ---------- */
function showSlide(index) {
  if (isAnimating || !slides.length) return;
  isAnimating = true;

  slides.forEach((s) => s.classList.remove("active", "prev"));
  slides[currentSlide]?.classList.add("prev");

  currentSlide = index;
  slides[currentSlide]?.classList.add("active");

  updateParallax();
  setTimeout(() => (isAnimating = false), 700);
}

function nextSlide() {
  showSlide((currentSlide + 1) % slides.length);
}

function prevSlide() {
  showSlide((currentSlide - 1 + slides.length) % slides.length);
}

/* ---------- Autoplay ---------- */
function startAutoPlay() {
  clearInterval(autoPlayInterval);
  autoPlayInterval = setInterval(nextSlide, slideDuration);
}

/* ---------- Events ---------- */
if (prevBtn) prevBtn.addEventListener("click", prevSlide);
if (nextBtn) nextBtn.addEventListener("click", nextSlide);

if (slider) {
  slider.addEventListener("mousemove", (e) => {
    const r = slider.getBoundingClientRect();
    mouseX = e.clientX / r.width - 0.5;
    mouseY = e.clientY / r.height - 0.5;
    updateParallax();
  });
}

startAutoPlay();

/* ================= OVERLAYS ================= */

function openOverlay(name) {
  const el = $("#" + name + "Overlay");
  if (!el) return;
  el.classList.add("active");
  clearInterval(autoPlayInterval);
}

function closeOverlay(name) {
  const el = $("#" + name + "Overlay");
  if (!el) return;
  el.classList.remove("active");
  startAutoPlay();
}

/* ================= ADMIN (MONGO CONNECTED) ================= */

let users = [];

/* ---------- Fetch Users ---------- */
async function fetchUsers() {
  try {
    const res = await fetch("http://localhost:5000/api/users");
    users = await res.json();
    renderUsers();
  } catch (err) {
    console.error("Failed to fetch users:", err);
  }
}

/* ---------- Render Users ---------- */
function renderUsers() {
  const list = $("#usersList");
  if (!list) return;

  list.innerHTML = "";

  if (users.length === 0) {
    list.innerHTML = "<p>No users registered yet.</p>";
    return;
  }

  users.forEach((u, i) => {
    const div = document.createElement("div");
    div.className = "testimonial-card";
    div.innerHTML = `
      <p><strong>${u.username}</strong> — ${u.role}</p>

      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <button class="submit-btn" onclick="viewUserPhotos(${i})">
          View Photos
        </button>

        <button class="submit-btn" onclick="downloadUserPhotos(${i})">
          Download All
        </button>
      </div>
    `;
    list.appendChild(div);
  });
}

/* ---------- View Photos ---------- */
function viewUserPhotos(index) {
  const user = users[index];
  $("#photoUserTitle").innerText =
    "Photos uploaded by " + user.username;

  const grid = $("#photoGrid");
  grid.innerHTML = "";

  if (!user.photos || user.photos.length === 0) {
    grid.innerHTML = "<p>No photos uploaded yet.</p>";
  } else {
    user.photos.forEach((p) => {
      const img = document.createElement("img");
      img.src = p;
      img.className = "overlay-image";
      grid.appendChild(img);
    });
  }

  openOverlay("photos");
}

/* ---------- DOWNLOAD USER PHOTOS ---------- */
function downloadUserPhotos(index) {
  const user = users[index];

  if (!user.photos || user.photos.length === 0) {
    alert("No photos to download.");
    return;
  }

  user.photos.forEach((base64, i) => {
    const link = document.createElement("a");
    link.href = base64;
    link.download = `${user.username}_photo_${i + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

/* ---------- Register User ---------- */
async function registerUser() {
  const username = $("#regUsername").value.trim();
  const password = $("#regPassword").value.trim();
  const role = $("#regRole").value;
  const msg = $("#registerSuccessMsg");

  if (!username || !password) {
    alert("Username and password required");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role })
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Registration failed");
      return;
    }

    msg.style.display = "block";

    $("#regUsername").value = "";
    $("#regPassword").value = "";
    $("#regRole").value = "guest";

    await fetchUsers();

    setTimeout(() => {
      msg.style.display = "none";
    }, 3000);

  } catch (err) {
    console.error("Register error:", err);
  }
}

/* ---------- INIT ---------- */
window.addEventListener("load", fetchUsers);

/* =========================================================
   UI TOGGLE (EYE BUTTON)
========================================================= */

(function () {
  const uiToggleBtn = document.getElementById("uiToggleBtn");
  const eyeIcon = document.getElementById("eyeIcon");
  let uiVisible = true;

  if (!uiToggleBtn || !eyeIcon) return;

  const eyeOpen = `
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  `;

  const eyeClosed = `
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8
      a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4
      c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  `;

  uiToggleBtn.addEventListener("click", () => {
    const uiEls = document.querySelectorAll(".ui-element");
    uiVisible = !uiVisible;

    uiEls.forEach(el =>
      el.classList.toggle("hidden", !uiVisible)
    );

    eyeIcon.innerHTML = uiVisible ? eyeOpen : eyeClosed;
  });
})();

/* ---------- FULLSCREEN ---------- */
(function () {
  const btn = document.getElementById("fullscreenBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      document.exitFullscreen?.() ||
        document.webkitExitFullscreen?.();
    } else {
      document.documentElement.requestFullscreen?.() ||
        document.documentElement.webkitRequestFullscreen?.();
    }
  });
})();
/* ================= MENU SAVE ================= */

async function saveMenu() {
  const content = document.getElementById("menuTextarea").value.trim();
  const msg = document.getElementById("menuSavedMsg");

  if (!content) {
    alert("Menu cannot be empty");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": localStorage.getItem("userId"),
        "x-user-role": localStorage.getItem("role")
      },
      body: JSON.stringify({ content })
    });

    if (!res.ok) {
      alert("Failed to save menu");
      return;
    }

    msg.style.display = "block";
    setTimeout(() => (msg.style.display = "none"), 3000);
  } catch (err) {
    console.error("Menu save error:", err);
  }
}
