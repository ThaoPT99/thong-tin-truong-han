(function () {
  const ZALO_GROUP_URL = "https://zalo.me/g/1oq8ngti4pcbfmxdbe9g";
  function dismissPopup(hours) {
    const overlay = document.getElementById("zalo-popup");
    if (!overlay) return;
    overlay.classList.remove("is-open");
    document.body.classList.remove("zalo-popup-open");
    // Lưu thời gian đóng để không tự động mở lại trong khoảng thời gian này
    if (hours > 0) {
      try {
        localStorage.setItem("zaloPopupDismissedAt", Date.now().toString());
      } catch (e) {}
    }
  }


  function openPopup() {
    const overlay = document.getElementById("zalo-popup");
    if (!overlay) return;
    overlay.classList.add("is-open");
    document.body.classList.add("zalo-popup-open");
  }

  function initZaloPopup() {
    const overlay = document.getElementById("zalo-popup");
    if (!overlay) return;

    overlay.querySelector(".zalo-popup-close")?.addEventListener("click", () => dismissPopup(24));
    overlay.querySelector(".zalo-popup-later")?.addEventListener("click", () => dismissPopup(24));
    overlay.querySelector(".zalo-popup-backdrop")?.addEventListener("click", () => dismissPopup(24));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) {
        dismissPopup(24);
      }
    });

  }

  // Dark mode toggle
  function initThemeToggle() {
    const btn = document.getElementById("theme-toggle");
    const icon = document.getElementById("theme-icon");
    if (!btn) return;

    const saved = localStorage.getItem("d26Theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (saved === "dark" || (!saved && prefersDark)) {
      document.documentElement.setAttribute("data-theme", "dark");
      if (icon) icon.textContent = "☀️";
    }

    btn.addEventListener("click", () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      if (isDark) {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("d26Theme", "light");
        if (icon) icon.textContent = "🌙";
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("d26Theme", "dark");
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
  window.ZALO_GROUP_URL = ZALO_GROUP_URL;
})();
