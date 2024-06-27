document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.remove('is-loading');
    
    document.querySelectorAll('#icons01 a').forEach(icon => {
        icon.addEventListener('mouseover', () => {
            icon.querySelector('svg').style.fill = 'rgba(217, 217, 217, 0.49)';
        });
        icon.addEventListener('mouseout', () => {
            icon.querySelector('svg').style.fill = '#E3E3E3';
        });
    });
});
