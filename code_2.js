document.addEventListener('DOMContentLoaded', function() {
    const name_p = document.getElementById("name_coffe_p2");//name of product
    const count_p = document.getElementById("count_coffe_p2");


    selected_coffe = JSON.parse(localStorage.getItem('selected_coffe'));


    name_p.innerHTML = selected_coffe.name;
    count_p.textContent = selected_coffe.count;


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