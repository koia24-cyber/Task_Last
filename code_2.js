document.addEventListener('DOMContentLoaded', function () {
    const nameEl = document.getElementById('name_coffe_p2');
    const countBadge = document.getElementById('count_coffe_p2');
    const qtyValueEl = document.querySelector('.qty-value');
    const qtyBtns = document.querySelectorAll('.qty-btn');
    const placeOrderBtn = document.querySelector('.place-order-btn');
    const hideBtn = document.querySelector('.hide-btn');
    const overlay = document.querySelector('.overlay');
    const panel = document.querySelector('.order-status-panel');
    const orderedItemsContainer = document.querySelector('.status-steps .step:first-child .step-items');
    const subtotalEl = document.querySelector('.summary .row:first-child span:last-child');
    const discountEl = document.querySelector('.summary .row:nth-child(2) span:last-child');
    const totalEl = document.querySelector('.summary .row.total span:last-child');

    let coffeData = [];
    try {
        const saved = localStorage.getItem('coffeData');
        if (saved) coffeData = JSON.parse(saved);
        else if (typeof window.coffeData !== 'undefined') {
            coffeData = JSON.parse(JSON.stringify(window.coffeData));
        }
    } catch (e) {
        if (typeof window.coffeData !== 'undefined') {
            coffeData = JSON.parse(JSON.stringify(window.coffeData));
        }
    }

    let selected_coffe = null;
    try {
        const saved = localStorage.getItem('selected_coffe');
        if (saved) selected_coffe = JSON.parse(saved);
    } catch (e) {}

    if (!selected_coffe || !selected_coffe.id) {
        const fallback = coffeData.find(c => c.id === 1) || {
            id: 1, name: 'Coffee', count: 0, price: 9.99,
            size: 'SHORT', extra: 'SUGAR', milk: 'ALMOND MILK'
        };
        selected_coffe = {
            id: fallback.id,
            name: fallback.name,
            type: fallback.type || 'Regular',
            description: fallback.description || 'images/img_coffe_1.png',
            count: fallback.count || 0,
            price: fallback.price || 9.99,
            size: fallback.size || 'SHORT',
            extra: fallback.extra || 'SUGAR',
            milk: fallback.milk || 'ALMOND MILK'
        };
        localStorage.setItem('selected_coffe', JSON.stringify(selected_coffe));
    }

    nameEl.textContent = selected_coffe.name;
    qtyValueEl.textContent = selected_coffe.count;
    countBadge.textContent = selected_coffe.count;

    function setupButtonGroup(selector, iconMap = null) {
        const buttons = document.querySelectorAll(selector);
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => {
                    b.classList.remove('active');
                    if (iconMap && b.querySelector('img')) {
                        b.querySelector('img').src = iconMap.default;
                    }
                });
                btn.classList.add('active');
                if (iconMap && btn.querySelector('img')) {
                    const key = btn.textContent.trim().toUpperCase();
                    btn.querySelector('img').src = iconMap[key] || iconMap.default;
                }
            });
        });
    }

    const sizeIconMap = {
        default: 'images/size_tall.svg',
        SHORT: 'images/size_short.svg',
        TALL: 'images/size_short.svg',
        GRANDE: 'images/size_short.svg',
        VENTI: 'images/size_short.svg'
    };

    setupButtonGroup('.size-btn', sizeIconMap);
    setupButtonGroup('.extra-btn');
    setupButtonGroup('.milk-btn');

    let currentQty = Math.max(1, parseInt(qtyValueEl.textContent) || 1);

    qtyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.textContent === '−') currentQty = Math.max(1, currentQty - 1);
            else if (btn.textContent === '+') currentQty += 1;

            qtyValueEl.textContent = currentQty;
            selected_coffe.count = currentQty;
            countBadge.textContent = currentQty;
            localStorage.setItem('selected_coffe', JSON.stringify(selected_coffe));
        });
    });

    function getCurrentOptions() {
        const sizeBtn = document.querySelector('.size-btn.active');
        const extraBtn = document.querySelector('.extra-btn.active');
        const milkBtn = document.querySelector('.milk-btn.active');
        return {
            size: sizeBtn ? sizeBtn.textContent.trim().toUpperCase() : 'SHORT',
            extra: extraBtn ? extraBtn.textContent.trim().toUpperCase() : 'SUGAR',
            milk: milkBtn ? milkBtn.textContent.trim() : 'ALMOND MILK'
        };
    }

    function updateOrderSummary(items) {
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.count), 0);
        const discount = subtotal * 0.1;
        const total = subtotal - discount;
        subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
        discountEl.textContent = `₹${discount.toFixed(2)}`;
        totalEl.textContent = `₹${total.toFixed(2)}`;
    }

    function renderOrderedItems() {
        orderedItemsContainer.innerHTML = '';
        const items = coffeData.filter(item => item.count >= 1);
        if (items.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'item';
            empty.innerHTML = '<span>No items ordered</span>';
            orderedItemsContainer.appendChild(empty);
            updateOrderSummary([]);
            return;
        }

        items.forEach(item => {
            const imgSrc = item.description?.startsWith('images/') ? item.description : 'images/os_1.png';
            const size = item.size || 'SHORT';
            const extra = item.extra || 'SUGAR';
            const milk = item.milk || 'ALMOND MILK';

            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `
                <img src="${imgSrc}" alt="${item.name}" onerror="this.src='images/os_1.png'">
                <span>
                    ${item.name}<br>
                    <small>${size} • ${extra} • ${milk}</small>
                </span>
                <span class="count">${item.count}</span>
            `;
            orderedItemsContainer.appendChild(div);
        });

        updateOrderSummary(items);
    }

    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', () => {
            const opts = getCurrentOptions();
            selected_coffe.size = opts.size;
            selected_coffe.extra = opts.extra;
            selected_coffe.milk = opts.milk;
            selected_coffe.count = currentQty;

            const item = coffeData.find(i => i.id === selected_coffe.id);
            if (item) {
                item.size = opts.size;
                item.extra = opts.extra;
                item.milk = opts.milk;
                item.count = currentQty;
            } else {
                coffeData.push({ ...selected_coffe });
            }

            localStorage.setItem('selected_coffe', JSON.stringify(selected_coffe));
            localStorage.setItem('coffeData', JSON.stringify(coffeData));

            renderOrderedItems();
            panel.classList.add('active');
            overlay.classList.add('active');
        });
    }

    function closePanel() {
        panel.classList.remove('active');
        overlay.classList.remove('active');
    }

    if (hideBtn) hideBtn.addEventListener('click', closePanel);
    if (overlay) overlay.addEventListener('click', closePanel);

    const sizeBtns = document.querySelectorAll('.size-btn');
    sizeBtns.forEach(btn => btn.classList.remove('active'));
    let sizeBtn = Array.from(sizeBtns).find(b => b.textContent.trim().toUpperCase() === selected_coffe.size);
    if (!sizeBtn) sizeBtn = sizeBtns[0];
    if (sizeBtn) {
        sizeBtn.classList.add('active');
        if (sizeBtn.querySelector('img')) sizeBtn.querySelector('img').src = 'images/size_short.svg';
        sizeBtns.forEach(b => {
            if (b !== sizeBtn && b.querySelector('img')) {
                b.querySelector('img').src = 'images/size_tall.svg';
            }
        });
    }

    document.querySelectorAll('.extra-btn').forEach(b => b.classList.remove('active'));
    let extraBtn = Array.from(document.querySelectorAll('.extra-btn')).find(b =>
        b.textContent.trim().toUpperCase() === selected_coffe.extra
    );
    if (!extraBtn) extraBtn = document.querySelector('.extra-btn');
    if (extraBtn) extraBtn.classList.add('active');

    document.querySelectorAll('.milk-btn').forEach(b => b.classList.remove('active'));
    let milkBtn = Array.from(document.querySelectorAll('.milk-btn')).find(b =>
        b.textContent.trim() === selected_coffe.milk
    );
    if (!milkBtn) milkBtn = document.querySelector('.milk-btn.active') || document.querySelector('.milk-btn');
    if (milkBtn) milkBtn.classList.add('active');
});