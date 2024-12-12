/**
 *
 * @param event
 * @returns {*}
 */
export const sanitizedInput = (event) => {
    let sanitizedInput = event.target.value.replace(/[^a-zA-Z ]/g, "");
    event.target.value = sanitizedInput;
    return sanitizedInput;
};

/**
 *
 * @param items
 */
export const updateDropdownList = (items) => {
    const dropdownList = document.querySelector('.dropdown-list');
    dropdownList.innerHTML = '';
    items.forEach(item => {
        const li = document.createElement('li');
        li.classList.add('dropdown-item');
        li.textContent = item;
        dropdownList.appendChild(li);
    });
};

export const selectedItems = {
    ingredients: new Set(),
    appliances: new Set(),
    utensils: new Set(),
};
