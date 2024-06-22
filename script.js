class ClientInfo {}

document.addEventListener('DOMContentLoaded', () => {
    new ClientInfo();
    const $body = document.body;

    setTimeout(() => {
        $body.classList.replace('is-loading', 'is-playing');
        setTimeout(() => $body.classList.replace('is-playing', 'is-ready'), 3625);
    }, 100);
    
});
