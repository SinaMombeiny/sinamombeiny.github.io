(function() {
    const loadElements = (parent) => {
        parent.querySelectorAll('iframe[data-src]:not([data-src=""])').forEach(iframe => {
            iframe.src = iframe.dataset.src;
            iframe.dataset.src = '';
        });

        parent.querySelectorAll('video[autoplay]').forEach(video => {
            if (video.paused) video.play();
        });
    };

    const startAnimation = () => {
        const body = document.body;
        body.classList.add('is-playing');
        
        setTimeout(() => {
            body.classList.remove('is-playing');
            body.classList.add('is-ready');
        }, 3625);
    };

    const init = async () => {
        const body = document.body;

        const icons = document.querySelectorAll('#icons01 a');
        icons.forEach(icon => {
            const svg = icon.querySelector('svg');
            icon.addEventListener('mouseenter', () => svg.style.fill = 'rgba(217, 217, 217, 0.49)');
            icon.addEventListener('mouseleave', () => svg.style.fill = '#E3E3E3');
        });

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            const updateViewport = () => {
                const vh = window.innerHeight;
                document.documentElement.style.setProperty('--viewport-height', `${vh}px`);
                document.documentElement.style.setProperty('--background-height', `${vh + 250}px`);
            };

            window.addEventListener('resize', updateViewport);
            window.addEventListener('orientationchange', () => setTimeout(updateViewport, 100));
            updateViewport();
            
            body.classList.add('is-mobile');
        }

        body.classList.remove('is-loading');
        startAnimation();
    };

    if (!document.body.classList.contains('is-loading')) {
        document.body.classList.add('is-loading');
    }

    window.addEventListener('load', init);
})();
