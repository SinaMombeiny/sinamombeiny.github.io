(function() {
    const ua = navigator.userAgent;
    const browser = (/Firefox\//.test(ua)) ? 'firefox' : 
                    (/Chrome\//.test(ua)) ? 'chrome' : 'other';

    const client = {
        browser: browser,
        mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
        os: (/iPhone|iPad|iPod/.test(ua)) ? 'ios' : 
            (/Android/.test(ua)) ? 'android' : 'other'
    };

    const loadElements = (parent) => {
        parent.querySelectorAll('iframe[data-src]:not([data-src=""])').forEach(iframe => {
            iframe.src = iframe.dataset.src;
            iframe.dataset.src = '';
        });

        parent.querySelectorAll('video[autoplay]').forEach(video => {
            if (video.paused) video.play();
        });
    };

    const init = async () => {
        const body = document.body;

        setTimeout(() => {
            body.classList.remove('is-loading');
            body.classList.add('is-playing');
            
            setTimeout(() => {
                body.classList.remove('is-playing');
                body.classList.add('is-ready');
            }, 3625);
        }, 100);

        loadElements(document.body);

        const icons = document.querySelectorAll('#icons01 a');
        icons.forEach(icon => {
            const svg = icon.querySelector('svg');
            icon.addEventListener('mouseenter', () => svg.style.fill = 'rgba(217, 217, 217, 0.49)');
            icon.addEventListener('mouseleave', () => svg.style.fill = '#E3E3E3');
        });

        if (client.mobile) {
            const updateViewport = () => {
                const vh = window.innerHeight;
                document.documentElement.style.setProperty('--viewport-height', `${vh}px`);
                document.documentElement.style.setProperty('--background-height', `${vh + 250}px`);
            };

            window.addEventListener('resize', updateViewport);
            window.addEventListener('orientationchange', () => setTimeout(updateViewport, 100));
            updateViewport();
        }

        if (client.os === 'android') {
            const updateBodyAfterHeight = () => {
                document.body.style.setProperty('--body-after-height', `${Math.max(screen.width, screen.height)}px`);
            };

            window.addEventListener('resize', updateBodyAfterHeight);
            window.addEventListener('orientationchange', updateBodyAfterHeight);
            updateBodyAfterHeight();
        }

        body.classList.add(client.browser);
        if (client.mobile) body.classList.add('is-mobile');
    };

    if (!document.body.classList.contains('is-loading')) {
        document.body.classList.add('is-loading');
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
