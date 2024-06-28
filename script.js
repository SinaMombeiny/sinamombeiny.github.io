(async () => {
    const startAnimation = () => {
      console.log('Animation started');
    };
  
    const init = () => {
      document.body.classList.remove('is-loading');
      startAnimation();
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
