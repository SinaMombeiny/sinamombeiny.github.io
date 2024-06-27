document.addEventListener("DOMContentLoaded", function() {
    document.body.classList.remove('is-loading');

    const icons = document.querySelectorAll('#icons01 a');
    icons.forEach(function(icon) {
        icon.addEventListener('mouseover', function() {
            let svg = this.querySelector('svg');
            if (svg) {
                svg.style.fill = 'rgba(217, 217, 217, 0.49)';
            }
        });
        icon.addEventListener('mouseout', function() {
            let svg = this.querySelector('svg');
            if (svg) {
                svg.style.fill = '#E3E3E3';
            }
        });
    });
});
