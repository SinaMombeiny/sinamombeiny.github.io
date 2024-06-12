class ClientInfo {
    constructor() {
        this.browser = 'other';
        this.browserVersion = 0;
        this.os = 'other';
        this.osVersion = 0;
        this.mobile = false;
        this.flags = {
            lsdUnits: false
        };
        this.init();
    }

    init() {
        this.detectBrowser();
        this.detectOS();
        this.checkMobile();
        this.checkLSdUnits();
    }

    detectBrowser() {
        const ua = navigator.userAgent;
        const browsers = [
            ['firefox', /Firefox\/([0-9\.]+)/],
            ['edge', /Edge\/([0-9\.]+)/],
            ['safari', /Version\/([0-9\.]+).+Safari/],
            ['chrome', /Chrome\/([0-9\.]+)/],
            ['chrome', /CriOS\/([0-9\.]+)/],
            ['ie', /Trident\/.+rv:([0-9]+)/]
        ];
        for (let [name, regex] of browsers) {
            const match = ua.match(regex);
            if (match) {
                this.browser = name;
                this.browserVersion = parseFloat(match[1]);
                break;
            }
        }
    }

    detectOS() {
        const ua = navigator.userAgent;
        const oses = [
            ['ios', /([0-9_]+) like Mac OS X/, v => v.replace('_', '.').replace('_', '')],
            ['ios', /CPU like Mac OS X/, v => 0],
            ['ios', /iPad; CPU/, v => 0],
            ['android', /Android ([0-9\.]+)/],
            ['mac', /Macintosh.+Mac OS X ([0-9_]+)/, v => v.replace('_', '.').replace('_', '')],
            ['windows', /Windows NT ([0-9\.]+)/]
        ];
        for (let [name, regex, versionTransform] of oses) {
            const match = ua.match(regex);
            if (match) {
                this.os = name;
                this.osVersion = parseFloat(versionTransform ? versionTransform(match[1]) : match[1]);
                break;
            }
        }
    }

    checkMobile() {
        this.mobile = (this.os === 'android' || this.os === 'ios');
    }

    checkLSdUnits() {
        const div = document.createElement('div').style;
        this.flags.lsdUnits = 'width' in div && (div.width = '100dvw') && div.width === '100dvw';
    }
}

class Utilities {
    static trigger(event) {
        window.dispatchEvent(new Event(event));
    }

    static escapeHtml(str) {
        if (!str) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return str.replace(/[&<>"']/g, m => map[m]);
    }

    static scrollToElement(element, style = 'smooth', duration = 750) {
        const y = element ? element.offsetTop + (parseInt(element.dataset.scrollOffset || 0) * parseFloat(getComputedStyle(document.documentElement).fontSize)) : 0;
        const start = Date.now();
        const cy = window.scrollY;
        const dy = y - cy;
        const easing = t => style === 'linear' ? t : (t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1);

        requestAnimationFrame(function scroll() {
            const t = Date.now() - start;
            if (t >= duration) {
                window.scroll(0, y);
            } else {
                window.scroll(0, cy + (dy * easing(t / duration)));
                requestAnimationFrame(scroll);
            }
        });
    }

    static loadElements(parent) {
        const iframes = parent.querySelectorAll('iframe[data-src]:not([data-src=""])');
        iframes.forEach(iframe => {
            iframe.contentWindow.location.replace(iframe.dataset.src);
            iframe.dataset.initialSrc = iframe.dataset.src;
            iframe.dataset.src = '';
        });

        const videos = parent.querySelectorAll('video[autoplay]');
        videos.forEach(video => {
            if (video.paused) video.play();
        });

        const autofocusElement = parent.querySelector('[data-autofocus="1"]');
        if (autofocusElement) autofocusElement.focus();

        const scripts = parent.querySelectorAll('deferred-script');
        scripts.forEach(script => {
            const newScript = document.createElement('script');
            if (script.src) newScript.src = script.src;
            if (script.textContent) newScript.textContent = script.textContent;
            script.replaceWith(newScript);
        });
    }

    static unloadElements(parent) {
        const iframes = parent.querySelectorAll('iframe[data-src=""]');
        iframes.forEach(iframe => {
            if (iframe.dataset.srcUnload === '0') return;
            iframe.dataset.src = iframe.dataset.initialSrc || iframe.src;
            iframe.contentWindow.location.replace('about:blank');
        });

        const videos = parent.querySelectorAll('video');
        videos.forEach(video => {
            if (!video.paused) video.pause();
        });

        const focusedElement = document.querySelector(':focus');
        if (focusedElement) focusedElement.blur();
    }
}
(function() {
    const client = new ClientInfo();
    const $body = document.body;

    window._scrollToTop = () => Utilities.scrollToElement(null);

    window.addEventListener('load', () => {
        setTimeout(() => {
            $body.classList.remove('is-loading');
            $body.classList.add('is-playing');
            setTimeout(() => {
                $body.classList.remove('is-playing');
                $body.classList.add('is-ready');
            }, 3625);
        }, 100);
    });

    Utilities.loadElements(document.body);

    if (client.mobile) {
        const updateViewport = () => {
            document.documentElement.style.setProperty('--viewport-height', window.innerHeight + 'px');
            document.documentElement.style.setProperty('--background-height', (window.innerHeight + 250) + 'px');
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

        window.addEventListener('load', updateBodyAfterHeight);
        window.addEventListener('orientationchange', updateBodyAfterHeight);
        window.addEventListener('touchmove', updateBodyAfterHeight);
        $body.classList.add('is-touch');
    } else if (client.os === 'ios') {
        if (client.osVersion <= 11) {
            document.querySelector('body::after').style.webkitTransform = 'scale(1.0)';
            if (client.osVersion <= 11) {
                document.querySelector('body.ios-focus-fix::before').style.height = 'calc(100% + 60px)';
                window.addEventListener('focus', () => $body.classList.add('ios-focus-fix'), true);
                window.addEventListener('blur', () => $body.classList.remove('ios-focus-fix'), true);
            }
        }
        $body.classList.add('is-touch');
    }
})();
