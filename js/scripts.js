// Hamburger menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.querySelector('i').classList.toggle('fa-bars');
    menuToggle.querySelector('i').classList.toggle('fa-xmark');
});

// Timeline hover animation
document.querySelectorAll('.timeline-content').forEach(box => {
    box.addEventListener('mousemove', e => {
        const rect = box.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        box.style.transform = `translate(${x/50}px, ${y/50}px)`;
    });

    box.addEventListener('mouseleave', () => {
        box.style.transform = `translate(0,0)`;
    });
});

// Optional: Smooth scroll for nav links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
        if(navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').classList.add('fa-bars');
            menuToggle.querySelector('i').classList.remove('fa-xmark');
        }
    });
});
