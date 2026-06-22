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

  var lastOpenSource = "auto_popup";

  function setOpenSource(source) {
    lastOpenSource = source;
  }

  function openPopup() {
    const overlay = document.getElementById("zalo-popup");
    if (!overlay) return;
    overlay.classList.add("is-open");
    document.body.classList.add("zalo-popup-open");
    // Track A/B test variant khi mở popup
    try {
      if (typeof window.trackAnalytics === "function") {
        window.trackAnalytics("event", {
          eventType: "zalo_popup_open",
          eventData: {
            variant: (window.__AB && window.__AB['zalo-fab']) || "a",
            source: lastOpenSource
          }
        });
      }
    } catch (e) {}
  }

  function checkAutoShowPopup() {
    try {
      const dismissedAt = localStorage.getItem("zaloPopupDismissedAt");
      const now = Date.now();
      // 12 giờ = 12 * 60 * 60 * 1000 = 43200000 ms
      if (!dismissedAt || (now - parseInt(dismissedAt, 10)) > 43200000) {
        // A/B test: zalo-timing
        // A = 15s (current), B = 45s
        var timingVariant = (window.__AB && window.__AB['zalo-timing']) || "a";
        var delay = timingVariant === "b" ? 45000 : 15000;
        setTimeout(openPopup, delay);
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

  function initAll() {
    initZaloPopup();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

  window.openZaloPopup = function() {
    setOpenSource("fab_click");
    openPopup();
  };
})();
