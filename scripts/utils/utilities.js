/**
 * Sanitizes the input from an event by removing all non-alphabetic characters.
 *
 * This function ensures that only letters and spaces remain in the input field's value.
 * The modified value is directly applied to the input field and also returned.
 *
 * @param {Event} event - The input event triggered by a user typing in an input field.
 * @returns {string} The sanitized input string containing only letters and spaces.
 */
export const sanitizedInput = (event) => {
    let sanitizedInput = event.target.value.replace(/[^a-zA-Z ]/g, "");
    event.target.value = sanitizedInput;
    return sanitizedInput;
};

/**
 * Updates the HTML content of a dropdown list with new items.
 *
 * This function:
 * - Clears the current list items of a dropdown.
 * - Dynamically creates new list elements for each item provided in the `items` array.
 *
 * @param {Array<string>} items - An array of strings to populate the dropdown list.
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
