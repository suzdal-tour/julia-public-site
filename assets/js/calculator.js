// Init date input

function formatDate(date) {

    return date.toISOString().slice(0, 10);
}

let minDate = new Date();
let maxDate = new Date();

maxDate.setMonth(maxDate.getMonth() + 6);

document.getElementById('datetime').min = formatDate(minDate);
document.getElementById('datetime').max = formatDate(maxDate);

// Calculator logic

const activitySelect = document.getElementById('activity');
const personsInput = document.getElementById('persons');
const totalPriceElement = document.getElementById('guideFee');
const childrenInput = document.getElementById('children');

let currentActivityId = null; // Храним текущий ID активности

/**
 * 
 * @param id Activity id
 * @param type Price type 
 * @returns 
 */
function getPriceByType(id, type) {
    if (!id) {
        return 0;
    }

    const priceTb = document.querySelector(`table[data-activity-price-id="${id}"]`);

    if (!priceTb) {
        return 0;
    }

    const priceTd = priceTb.querySelector(`td[data-activity-price-type="${type}"]`);

    if (!priceTd) {
        return 0;
    }

    return parseFloat(priceTd.textContent.trim());
}

function updateTotalPrice() {
    if (!currentActivityId) {
        totalPriceElement.value = 'Выберите активность';
        return;
    }

    const persons = parseInt(personsInput.value) || 0;
    const children = childrenInput ? (parseInt(childrenInput.value) || 0) : 0; 

    const defaultPrice =
        getPriceByType(currentActivityId, 'Стандартный') ||
        getPriceByType(currentActivityId, 'Стандартный билет');

    const childrenPrice = getPriceByType(currentActivityId, 'children');

    const total = (defaultPrice * persons) + (childrenPrice * children);

    if (total === 0) {
        totalPriceElement.value = 'Ошибка';
    } else {
        totalPriceElement.value = total.toString();
    }
}

activitySelect.addEventListener('change', function () {
    const selectedOption = activitySelect.options[activitySelect.selectedIndex];
    if (selectedOption) {
        currentActivityId = selectedOption.getAttribute('data-booking-activity-id');
    } else {
        currentActivityId = null;
    }
    updateTotalPrice(); // Пересчитываем итог
});

personsInput.addEventListener('input', updateTotalPrice);

// Слушаем изменения в input children только если он существует
if (childrenInput) {
    childrenInput.addEventListener('input', updateTotalPrice);
}

if (activitySelect.selectedIndex >= 0) {
    const selectedOption = activitySelect.options[activitySelect.selectedIndex];
    if (selectedOption) {
        currentActivityId = selectedOption.getAttribute('data-booking-activity-id');
    }
}

updateTotalPrice();