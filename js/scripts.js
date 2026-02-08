// Navbar toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
});

// Animate skill circles
const skillCircles = document.querySelectorAll(".skill-circle");
skillCircles.forEach(circle => {
    const percent = circle.getAttribute("data-percent");
    let start = 0;
    const interval = setInterval(() => {
        start++;
        circle.style.background = `conic-gradient(#3498db 0% ${start}%, #e0e0e0 ${start}% 100%)`;
        if (start >= percent) clearInterval(interval);
    }, 15);
});
