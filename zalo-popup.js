(function () {
  const ZALO_GROUP_URL = "https://zalo.me/g/1oq8ngti4pcbfmxdbe9g";
  const STORAGE_KEY = "zaloPopupDismissedUntil";

  function shouldShowPopup() {
    const until = localStorage.getItem(STORAGE_KEY);
    if (!until) return true;
    return Date.now() > Number(until);
  }

  function dismissPopup(hours) {
    const overlay = document.getElementById("zalo-popup");
    if (!overlay) return;
    overlay.classList.remove("is-open");
    document.body.classList.remove("zalo-popup-open");
    if (hours > 0) {
      localStorage.setItem(STORAGE_KEY, String(Date.now() + hours * 60 * 60 * 1000));
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

    if (shouldShowPopup()) {
      requestAnimationFrame(() => openPopup());
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initZaloPopup);
  } else {
    initZaloPopup();
  }

  window.openZaloPopup = openPopup;
  window.ZALO_GROUP_URL = ZALO_GROUP_URL;
})();
