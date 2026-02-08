// Timeline Animation
document.addEventListener("DOMContentLoaded", function() {
    const timelineItems = document.querySelectorAll(".timeline-item");

    function showTimeline() {
        const triggerBottom = window.innerHeight * 0.85;
        timelineItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            if(itemTop < triggerBottom) {
                item.classList.add("show");
            }
        });
    }

    window.addEventListener("scroll", showTimeline);
    showTimeline(); // Initial check
});

// Smooth scroll for nav links
document.querySelectorAll('.navbar-nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
