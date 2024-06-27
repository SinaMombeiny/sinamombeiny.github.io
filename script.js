class ClientInfo {
    constructor() {
        this.init();
    }

    init() {
        const ua = navigator.userAgent;
        this.browser = this.detectBrowser(ua);
        this.os = this.detectOS(ua);
        this.mobile = ['android', 'ios'].includes(this.os);
        this.flags = { lsdUnits: CSS.supports('width', '100dvw') };
    }

    detectBrowser(ua) {
        const browsers = [
            ['firefox', /Firefox/],
            ['edge', /Edge/],
            ['safari', /Safari/],
            ['chrome', /Chrome|CriOS/],
            ['ie', /Trident/]
        ];
        return browsers.find(([, regex]) => regex.test(ua))?.[0] || 'other';
    }

    detectOS(ua) {
        const oses = [
            ['ios', /iPhone|iPad|iPod/],
            ['android', /Android/],
            ['mac', /Macintosh/],
            ['windows', /Windows NT/]
        ];
        return oses.find(([, regex]) => regex.test(ua))?.[0] || 'other';
    }
}

const Utilities = {
    trigger: event => window.dispatchEvent(new Event(event)),
    
    scrollToElement: (element, duration = 750) => {
        const start = Date.now();
        const y = element?.offsetTop || 0;
        const scroll = () => {
            const p = Math.min(1, (Date.now() - start) / duration);
            window.scrollTo(0, y * p);
            p < 1 && requestAnimationFrame(scroll);
        };
        scroll();
    },
    
    handleElements: (parent, action) => {
        const actions = {
            load: {
                'iframe[data-src]:not([data-src=""])': el => {
                    el.contentWindow.location.replace(el.dataset.src);
                    [el.dataset.initialSrc, el.dataset.src] = [el.dataset.src, ''];
                },
                'video[autoplay]': el => el.paused && el.play(),
                '[data-autofocus="1"]': el => el.focus(),
                'deferred-script': el => {
                    const newScript = document.createElement('script');
                    if (el.src) newScript.src = el.src;
                    if (el.textContent) newScript.textContent = el.textContent;
                    el.replaceWith(newScript);
                }
            },
            unload: {
                'iframe[data-src=""]': el => {
                    if (el.dataset.srcUnload !== '0') {
                        el.dataset.src = el.dataset.initialSrc || el.src;
                        el.contentWindow.location.replace('about:blank');
                    }
                },
                'video': el => !el.paused && el.pause()
            }
        };

        Object.entries(actions[action]).forEach(([selector, fn]) => 
            parent.querySelectorAll(selector).forEach(fn)
        );

        if (action === 'unload') document.activeElement?.blur();
    }
};

(() => {
    const client = new ClientInfo();
    const $body = document.body;

    window._scrollToTop = () => Utilities.scrollToElement();

    window.addEventListener('load', () => {
        setTimeout(() => {
            $body.classList.replace('is-loading', 'is-playing');
            setTimeout(() => $body.classList.replace('is-playing', 'is-ready'), 3625);
        }, 100);
    });

    Utilities.handleElements(document.body, 'load');

    if (client.mobile) {
        const updateViewport = () => {
            const vh = window.innerHeight;
            document.documentElement.style.setProperty('--viewport-height', `${vh}px`);
            document.documentElement.style.setProperty('--background-height', `${vh + 250}px`);
        };

        if (!client.flags.lsdUnits) {
            window.addEventListener('load', updateViewport);
            window.addEventListener('orientationchange', () => setTimeout(updateViewport, 100));
        } else {
            document.documentElement.style.setProperty('--viewport-height', '100svh');
            document.documentElement.style.setProperty('--background-height', '100lvh');
        }
    }

    if (client.os === 'android') {
        const updateBodyAfterHeight = () => {
            document.querySelector('body::after').style.height = `${Math.max(screen.width, screen.height)}px`;
        };

        ['load', 'orientationchange', 'touchmove'].forEach(event => 
            window.addEventListener(event, updateBodyAfterHeight)
        );
        $body.classList.add('is-touch');
    } else if (client.os === 'ios') {
        if (client.osVersion <= 11) {
            document.querySelector('body::after').style.webkitTransform = 'scale(1.0)';
            if (client.osVersion <= 11) {
                document.querySelector('body.ios-focus-fix::before').style.height = 'calc(100% + 60px)';
                ['focus', 'blur'].forEach(event => 
                    window.addEventListener(event, () => $body.classList.toggle('ios-focus-fix'), true)
                );
            }
        }
        $body.classList.add('is-touch');
    }
})();
