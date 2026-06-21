(function () {
  function dismissPopup() {
    const overlay = document.getElementById("zalo-popup");
    if (!overlay) return;
    overlay.classList.remove("is-open");
    document.body.classList.remove("zalo-popup-open");
    try {
      localStorage.setItem("zaloPopupDismissedAt", Date.now().toString());
    } catch (e) {}
  }

  function openPopup() {
    const overlay = document.getElementById("zalo-popup");
    if (!overlay) return;
    overlay.classList.add("is-open");
    document.body.classList.add("zalo-popup-open");
  }

  function checkAutoShowPopup() {
    try {
      const dismissedAt = localStorage.getItem("zaloPopupDismissedAt");
      const now = Date.now();
      // 12 giờ = 12 * 60 * 60 * 1000 = 43200000 ms
      if (!dismissedAt || (now - parseInt(dismissedAt, 10)) > 43200000) {
        // Tự động mở sau khi load trang 15 giây
        setTimeout(openPopup, 15000);
      }
    } catch (e) {}
  }

  function initZaloPopup() {
    const overlay = document.getElementById("zalo-popup");
    if (!overlay) return;

    overlay.querySelector(".zalo-popup-close")?.addEventListener("click", dismissPopup);
    overlay.querySelector(".zalo-popup-later")?.addEventListener("click", dismissPopup);
    overlay.querySelector(".zalo-popup-backdrop")?.addEventListener("click", dismissPopup);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) {
        dismissPopup();
      }
    });

    checkAutoShowPopup();
  }

  // Dark mode toggle
  function initThemeToggle() {
    const btn = document.getElementById("theme-toggle");
    const icon = document.getElementById("theme-icon");
    if (!btn) return;

    try {
      const saved = localStorage.getItem("d26Theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (saved === "dark" || (!saved && prefersDark)) {
        document.documentElement.setAttribute("data-theme", "dark");
        if (icon) icon.textContent = "☀️";
      }
    } catch (e) {}

    btn.addEventListener("click", () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      if (isDark) {
        document.documentElement.removeAttribute("data-theme");
        try { localStorage.setItem("d26Theme", "light"); } catch (e) {}
        if (icon) icon.textContent = "🌙";
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        try { localStorage.setItem("d26Theme", "dark"); } catch (e) {}
        if (icon) icon.textContent = "☀️";
      }
    });
  }

  function initAll() {
    initZaloPopup();
    initThemeToggle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

  window.openZaloPopup = openPopup;
})();
