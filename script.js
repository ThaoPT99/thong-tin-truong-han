// Smooth scroll for nav links
document.querySelectorAll('.nav-inner a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Highlight active nav on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-inner a');

function highlightNav() {
    const scrollY = window.pageYOffset + 150;
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollY >= top && scrollY < top + height) current = section.id;
    });
    navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === '#' + current ? 'var(--color-accent)' : '';
    });
}

window.addEventListener('scroll', highlightNav);
highlightNav();
