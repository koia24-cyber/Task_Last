document.addEventListener('DOMContentLoaded', () => {
    const addButtons = document.querySelectorAll('.coffee-card .add-btn');
    const coffeeCards = document.querySelectorAll('.coffee-card');
    const totalCountElement = document.getElementById('kolvo_coffe');

    function updateTotalCount() {
        const total = coffeData.reduce((sum, item) => sum + item.count, 0);
        totalCountElement.textContent = total;
    }

    function saveToLocalStorage() {
        localStorage.setItem('coffeData', JSON.stringify(coffeData));
    }

    function saveSelectedCoffee(index) {
        const selected = {
            id: coffeData[index].id,
            name: coffeData[index].name,
            type: coffeData[index].type,
            description: coffeData[index].description,
            price: coffeData[index].price
        };
        localStorage.setItem('selected_coffe', JSON.stringify(selected));
    }

    function loadFromLocalStorage() {
        const saved = localStorage.getItem('coffeData');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                for (let i = 0; i < coffeData.length && i < parsed.length; i++) {
                    if (coffeData[i].id === parsed[i].id) {
                        coffeData[i].count = parsed[i].count || 0;
                    }
                }
            } catch (e) {}
        }
    }

    loadFromLocalStorage();
    updateTotalCount();

    addButtons.forEach((button, index) => {
        if (index >= coffeData.length) return;
        button.addEventListener('click', () => {
            coffeData[index].count += 1;
            updateTotalCount();
            saveToLocalStorage();
        });
    });

    coffeeCards.forEach((card, index) => {
        if (index >= coffeData.length) return;
        card.addEventListener('click', (e) => {
            //пропустить клик, если он был по кнопке +
            if (e.target.closest('.add-btn')) return;
            saveSelectedCoffee(index);
            location.href = 'page_2.html';
        });
    });
});