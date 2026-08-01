#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Improve mobile sidebar UX: hamburger animation, body scroll lock, close-on-nav-click"""

import sys
sys.stdout.reconfigure(encoding='utf-8')

FILE = 'public/styles.css'
HTML_FILE = 'public/index.html'

with open(FILE, 'r', encoding='utf-8') as f:
    css = f.read()

# ============================================================
# 1. ADD hamburger animation + body scroll lock CSS
# ============================================================

# Find the end of sidebar-hamburger section and add animations
# Look for the pattern to insert after
insert_after = ".sidebar-hamburger:hover {\n    background: #f1f5f9;\n    border-color: #2563eb;\n    color: #2563eb;\n}"

if insert_after in css:
    new_css = """
/* Hamburger animate to X when open */
.sidebar-open .sidebar-hamburger svg {
    transition: transform 0.3s ease;
}
.sidebar-open .sidebar-hamburger svg path:nth-child(1) {
    transform-origin: center;
    animation: hamTopToX 0.3s ease forwards;
}
.sidebar-open .sidebar-hamburger svg path:nth-child(2) {
    animation: hamMidToX 0.3s ease forwards;
}
.sidebar-open .sidebar-hamburger svg path:nth-child(3) {
    transform-origin: center;
    animation: hamBottomToX 0.3s ease forwards;
}

@keyframes hamTopToX {
    50% { transform: translateY(0); }
    100% { transform: translateY(6px) rotate(45deg); }
}
@keyframes hamMidToX {
    100% { opacity: 0; }
}
@keyframes hamBottomToX {
    50% { transform: translateY(0); }
    100% { transform: translateY(-6px) rotate(-45deg); }
}

/* Reset hamburger when closing */
.sidebar-hamburger svg path {
    transition: all 0.3s ease;
}

/* Body scroll lock when sidebar open */
body.sidebar-open {
    overflow: hidden;
}

/* Better sidebar shadow on mobile */
.sidebar-open .app-sidebar {
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
}
"""
    css = css.replace(insert_after, insert_after + new_css)
    print("Added hamburger animation + scroll lock CSS")
else:
    print("ERROR: Could not find insertion point in CSS!")
    sys.exit(1)

# ============================================================
# 2. IMPROVE mobile sidebar visual styling
# ============================================================
# Add better padding and visual polish to the mobile sidebar

old_sidebar_mobile = """.sidebar-open .app-sidebar {
    transform: translateX(0);
    display: flex;
    flex-direction: column;
}"""

new_sidebar_mobile = """.sidebar-open .app-sidebar {
    transform: translateX(0);
    display: flex;
    flex-direction: column;
}

/* Mobile sidebar inner improvements */
@media (max-width: 900px) {
    .sidebar-open .app-sidebar .tabs-inner {
        padding: 0.75rem;
        gap: 4px;
        overflow-y: auto;
        flex: 1;
    }
    .sidebar-open .app-sidebar .tab-btn {
        width: 100%;
        justify-content: flex-start;
        padding: 0.7rem 1rem;
        font-size: 0.9rem;
    }
    .sidebar-open .app-sidebar .sidebar-divider {
        margin: 0.5rem 0.75rem;
        height: 1px;
        background: #e2e8f0;
        border: none;
    }
    /* Submenu trong sidebar mobile */
    .sidebar-open .app-sidebar .sidebar-submenu-wrap {
        width: 100%;
    }
    .sidebar-open .app-sidebar .sidebar-toggle-btn {
        width: 100%;
        justify-content: space-between;
        padding: 0.7rem 1rem;
    }
    .sidebar-open .app-sidebar .sidebar-submenu {
        width: 100%;
        padding: 0.25rem 0 0.25rem 1rem;
    }
    .sidebar-open .app-sidebar .sidebar-submenu .tab-btn {
        font-size: 0.82rem;
        padding: 0.55rem 0.75rem;
    }
}
"""

if old_sidebar_mobile in css:
    css = css.replace(old_sidebar_mobile, new_sidebar_mobile)
    print("Improved mobile sidebar visual styling")
else:
    # Try alternative pattern
    alt_search = "transform: translateX(0);\n    display: flex;\n    flex-direction: column;"
    if alt_search in css:
        css = css.replace(alt_search, alt_search + "\n}\n\n/* Mobile sidebar inner improvements */\n@media (max-width: 900px) {\n    .sidebar-open .app-sidebar .tabs-inner {\n        padding: 0.75rem;\n        gap: 4px;\n        overflow-y: auto;\n        flex: 1;\n    }\n    .sidebar-open .app-sidebar .tab-btn {\n        width: 100%;\n        justify-content: flex-start;\n        padding: 0.7rem 1rem;\n        font-size: 0.9rem;\n    }\n    .sidebar-open .app-sidebar .sidebar-divider {\n        margin: 0.5rem 0.75rem;\n        height: 1px;\n        background: #e2e8f0;\n        border: none;\n    }\n    .sidebar-open .app-sidebar .sidebar-submenu-wrap {\n        width: 100%;\n    }\n    .sidebar-open .app-sidebar .sidebar-toggle-btn {\n        width: 100%;\n        justify-content: space-between;\n        padding: 0.7rem 1rem;\n    }\n    .sidebar-open .app-sidebar .sidebar-submenu {\n        width: 100%;\n        padding: 0.25rem 0 0.25rem 1rem;\n    }\n    .sidebar-open .app-sidebar .sidebar-submenu .tab-btn {\n        font-size: 0.82rem;\n        padding: 0.55rem 0.75rem;\n    }\n}")
        print("Improved mobile sidebar visual styling (alt pattern)")
    else:
        print("Could not find sidebar-open transform pattern!")

with open(FILE, 'w', encoding='utf-8') as f:
    f.write(css)

print("CSS updated successfully!")

# ============================================================
# 3. UPDATE JS in index.html: add close-on-nav-click + scroll lock
# ============================================================

with open(HTML_FILE, 'r', encoding='utf-8') as f:
    html = f.read()

old_js = """      var toggle = document.getElementById('sidebarToggle');
      var backdrop = document.getElementById('sidebarBackdrop');
      var shell = document.querySelector('.app-shell');
      if (toggle && backdrop) {
        toggle.addEventListener('click', function(e) {
          e.stopPropagation();
          shell.classList.toggle('sidebar-open');
          toggle.setAttribute('aria-label', shell.classList.contains('sidebar-open') ? 'Đóng menu' : 'Mở menu');
        });
        backdrop.addEventListener('click', function() {
          shell.classList.remove('sidebar-open');
          toggle.setAttribute('aria-label', 'Mở menu');
        });
      }"""

new_js = """      var toggle = document.getElementById('sidebarToggle');
      var backdrop = document.getElementById('sidebarBackdrop');
      var shell = document.querySelector('.app-shell');
      var sidebar = document.querySelector('.app-sidebar');
      if (toggle && backdrop) {
        // Toggle sidebar
        toggle.addEventListener('click', function(e) {
          e.stopPropagation();
          var isOpen = shell.classList.toggle('sidebar-open');
          toggle.setAttribute('aria-label', isOpen ? 'Đóng menu' : 'Mở menu');
          document.body.classList.toggle('sidebar-open', isOpen);
        });
        // Close on backdrop click
        backdrop.addEventListener('click', function() {
          shell.classList.remove('sidebar-open');
          toggle.setAttribute('aria-label', 'Mở menu');
          document.body.classList.remove('sidebar-open');
        });
        // Close sidebar when clicking a nav item (on mobile)
        if (sidebar) {
          sidebar.querySelectorAll('.tab-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
              if (window.innerWidth <= 900) {
                shell.classList.remove('sidebar-open');
                toggle.setAttribute('aria-label', 'Mở menu');
                document.body.classList.remove('sidebar-open');
              }
            });
          });
        }
        // Close sidebar on window resize to desktop
        window.addEventListener('resize', function() {
          if (window.innerWidth > 900) {
            shell.classList.remove('sidebar-open');
            document.body.classList.remove('sidebar-open');
          }
        });
      }"""

if old_js in html:
    html = html.replace(old_js, new_js)
    print("Updated JS with close-on-nav-click + scroll lock")
else:
    print("ERROR: Could not find original JS in HTML!")

with open(HTML_FILE, 'w', encoding='utf-8') as f:
    f.write(html)

print("HTML updated successfully!")
print("Done!")