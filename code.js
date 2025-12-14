const addButtons = document.querySelectorAll('.coffee-card .add-btn');

const totalCountElement = document.getElementById('kolvo_coffe');

function updateTotalCount() {
        const total = coffeData.reduce((sum, item) => sum + item.count, 0);
        totalCountElement.textContent = String(total);
}

addButtons.forEach((button, index) => {
        if (index >= coffeData.length) {
            console.warn(`No coffee data for card index ${index}`);
            return;
        }

button.addEventListener('click', () => {
            coffeData[index].count += 1;

            updateTotalCount();

            console.log(`Added 1 ${coffeData[index].name}. Total: ${coffeData[index].count}`);
        });
    });

updateTotalCount();