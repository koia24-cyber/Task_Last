const addButtons = document.querySelectorAll('.coffee-card .add-btn');
const totalCountElement = document.getElementById('kolvo_coffe');

function updateTotalCount() {
        const total = coffeData.reduce((sum, item) => sum + item.count, 0);
        totalCountElement.textContent = total;
}

function saveToLocalStorage() {
        localStorage.setItem('coffeData', JSON.stringify(coffeData));
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