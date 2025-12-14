












document.addEventListener('DOMContentLoaded', function() {
    const placeOrderBtn = document.querySelector('.place-order-btn');
    const hideBtn = document.querySelector('.hide-btn');
    const overlay = document.querySelector('.overlay');
    const panel = document.querySelector('.order-status-panel');

    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function() {
            panel.classList.add('active');
            overlay.classList.add('active');
        });
    }

    if (hideBtn) {
        hideBtn.addEventListener('click', function() {
            panel.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', function() {
            panel.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
});