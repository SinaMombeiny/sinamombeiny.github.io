(() => {
    const startAnimation = () => {
      console.log('Animation started');
    };
  
    const init = () => {
      if (document.body.classList.contains('is-loading')) {
        document.body.classList.remove('is-loading');
        setTimeout(startAnimation, 50);
      } else {
        startAnimation();
      }
    };
  
    if (!document.body.classList.contains('is-loading')) {
      document.body.classList.add('is-loading');
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      window.requestAnimationFrame(init);
    }
  })();
