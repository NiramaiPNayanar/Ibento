/* =========================================================
   SUPER ADMIN EXTENSIONS
   Depends on admin.js being loaded first
========================================================= */

const API_BASE = "http://localhost:5000/api/users";

/* =========================================================
   SUPER ADMIN CONTEXT
========================================================= */
const CURRENT_USER_ID = localStorage.getItem("userId");
const CURRENT_USER_ROLE = "superadmin";

/* =========================================================
   FETCH USERS (OVERRIDES admin.js)
========================================================= */
async function fetchUsers() {
  try {
    const res = await fetch(API_BASE, {
      headers: {
        "x-user-id": CURRENT_USER_ID,
        "x-user-role": CURRENT_USER_ROLE
      }
    });

    users = await res.json();
    renderUsers();
  } catch (err) {
    console.error("Failed to fetch users:", err);
  }
}

/* =========================================================
   RENDER USERS (SUPERADMIN VIEW)
========================================================= */
function renderUsers() {
  const list = document.getElementById("usersList");
  if (!list) return;

  list.innerHTML = "";

  if (!users || users.length === 0) {
    list.innerHTML = "<p>No users found.</p>";
    return;
  }

  users.forEach((u) => {
    const card = document.createElement("div");
    card.className = "testimonial-card";

    card.innerHTML = `
      <p>
        <strong>${u.username}</strong><br>
        Role: <span style="opacity:.85">${u.role}</span>
      </p>

      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <button class="submit-btn" onclick="viewUserPhotosById('${u._id}')">
          View Photos
        </button>

        <button class="submit-btn" onclick="downloadUserPhotosById('${u._id}')">
          Download All
        </button>

        ${
          u.role !== "superadmin"
            ? `<button class="submit-btn" onclick="toggleRole('${u._id}', '${u.role}')">
                ${u.role === "admin" ? "Demote" : "Promote"}
              </button>`
            : ""
        }

        ${
          u.role !== "superadmin"
            ? `<button
                class="submit-btn"
                style="background:#ff4d4d;"
                onclick="deleteUser('${u._id}', '${u.username}')"
              >
                Delete
              </button>`
            : ""
        }
      </div>
    `;

    list.appendChild(card);
  });
}

/* =========================================================
   VIEW USER PHOTOS (BY ID)
========================================================= */
function viewUserPhotosById(userId) {
  const user = users.find(u => u._id === userId);
  if (!user) return;

  document.getElementById("photoUserTitle").innerText =
    "Photos uploaded by " + user.username;

  const grid = document.getElementById("photoGrid");
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

/* =========================================================
   DOWNLOAD USER PHOTOS (BY ID)
========================================================= */
function downloadUserPhotosById(userId) {
  const user = users.find(u => u._id === userId);
  if (!user) return;

  if (!user.photos || user.photos.length === 0) {
    alert("No photos to download.");
    return;
  }

  user.photos.forEach((photo, i) => {
    const link = document.createElement("a");
    link.href = photo;
    link.download = `${user.username}_photo_${i + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

/* =========================================================
   PROMOTE / DEMOTE USER
========================================================= */
async function toggleRole(userId, currentRole) {
  const newRole = currentRole === "admin" ? "guest" : "admin";

  if (!confirm(`Change role to "${newRole}"?`)) return;

  try {
    const res = await fetch(`${API_BASE}/${userId}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": CURRENT_USER_ID,
        "x-user-role": CURRENT_USER_ROLE
      },
      body: JSON.stringify({ role: newRole })
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Role update failed");
      return;
    }

    fetchUsers();
  } catch (err) {
    console.error("Role change error:", err);
  }
}

/* =========================================================
   DELETE USER
========================================================= */
async function deleteUser(userId, username) {
  if (!confirm(`Delete user "${username}" permanently?`)) return;

  try {
    const res = await fetch(`${API_BASE}/${userId}`, {
      method: "DELETE",
      headers: {
        "x-user-id": CURRENT_USER_ID,
        "x-user-role": CURRENT_USER_ROLE
      }
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Delete failed");
      return;
    }

    fetchUsers();
  } catch (err) {
    console.error("Delete error:", err);
  }
}

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

/* =========================================================
   MENU (ADMIN / SUPERADMIN)
========================================================= */

async function loadMenu() {
  try {
    const res = await fetch(`${API_BASE}/${CURRENT_USER_ID}`, {
      headers: {
        "x-user-id": CURRENT_USER_ID,
        "x-user-role": CURRENT_USER_ROLE
      }
    });

    const user = await res.json();
    document.getElementById("menuText").value = user.menu || "";
  } catch (err) {
    console.error("Load menu failed:", err);
  }
}

async function saveMenu() {
  const text = document.getElementById("menuText").value;
  const msg = document.getElementById("menuSavedMsg");

  try {
    await fetch(`${API_BASE}/${CURRENT_USER_ID}/menu`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": CURRENT_USER_ID,
        "x-user-role": CURRENT_USER_ROLE
      },
      body: JSON.stringify({ menu: text })
    });

    msg.style.display = "block";
    setTimeout(() => (msg.style.display = "none"), 3000);
  } catch (err) {
    console.error("Save menu failed:", err);
  }
}

/* Auto-load menu when overlay opens */
const originalOpenOverlay = window.openOverlay;
window.openOverlay = function (name) {
  originalOpenOverlay(name);
  if (name === "menu") loadMenu();
};


window.addEventListener("load", fetchUsers);

