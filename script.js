document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    
    setTimeout(() => {
        body.classList.remove('is-loading');
        body.classList.add('is-playing');
        
        setTimeout(() => {
            body.classList.remove('is-playing');
            body.classList.add('is-ready');
        }, 3625);
    }, 100);

    const icons = document.querySelectorAll('#icons01 a');
    icons.forEach(icon => {
        const svg = icon.querySelector('svg');
        icon.addEventListener('mouseenter', () => svg.style.fill = 'rgba(217, 217, 217, 0.49)');
        icon.addEventListener('mouseleave', () => svg.style.fill = '#E3E3E3');
    });
});

if (!document.body.classList.contains('is-loading')) {
    document.body.classList.add('is-loading');
}
