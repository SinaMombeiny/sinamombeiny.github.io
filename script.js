document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    const startAnimation = () => {
        body.classList.add('is-playing');
        
        setTimeout(() => {
            body.classList.replace('is-playing', 'is-ready');
        }, 3625);
    };

    if (!body.classList.contains('is-loading')) {
        body.classList.add('is-loading');
    }

    body.classList.remove('is-loading');
    startAnimation();
});
