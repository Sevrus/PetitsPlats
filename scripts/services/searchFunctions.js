import {selectedItems} from "../utils/utilities.js";

/**
 * Filters recipes based on selected ingredients, appliances, and utensils.
 *
 * @param {Array<Object>} recipes - An array of recipe objects to filter.
 * @param {Array<string>} selectedIngredients - Selected ingredient tags to filter by.
 * @param {Array<string>} selectedAppliances - Selected appliance tags to filter by.
 * @param {Array<string>} selectedUtensils - Selected utensil tags to filter by.
 * @returns {Array<Object>} - An array of filtered recipe objects.
 */
export const filterRecipesByAdvancedSearch = (recipes, selectedIngredients, selectedAppliances, selectedUtensils) => {
    return recipes.filter(recipe => {
        const ingredients = recipe["ingredients"] || [];
        const appliance = recipe["appliance"] || '';
        const utensils = recipe["ustensils"] || [];

        const ingredientMatch = selectedIngredients.every(tag =>
            ingredients.some(ingredient => ingredient["ingredient"]?.toLowerCase() === tag.toLowerCase())
        );

        const applianceMatch = selectedAppliances.every(tag =>
            appliance.toLowerCase() === tag.toLowerCase()
        );

        const utensilMatch = selectedUtensils.every(tag =>
            utensils.some(utensil => utensil.toLowerCase() === tag.toLowerCase())
        );

        return ingredientMatch && applianceMatch && utensilMatch;
    });
};

/**
 * Populates the dropdown lists with filtered items based on the selected recipes and tags.
 *
 * @param {Array<Object>} recipes - An array of recipe objects used to populate the dropdowns.
 * @param {Object} selectedItems - An object containing the selected tags for each category.
 */
export const populateDropdownLists = (recipes, selectedItems) => {
    const ingredientList = document.querySelector('.dropdown-section[data-category="ingredients"] .dropdown-list');
    const applianceList = document.querySelector('.dropdown-section[data-category="appliances"] .dropdown-list');
    const utensilList = document.querySelector('.dropdown-section[data-category="utensils"] .dropdown-list');

    const ingredients = new Set();
    const appliances = new Set();
    const utensils = new Set();

    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => ingredients.add(ingredient["ingredient"]));
        appliances.add(recipe["appliance"]);
        recipe["ustensils"].forEach(utensil => utensils.add(utensil));
    });

    const filterSelected = (set, category) => Array.from(set).filter(item => !selectedItems[category].has(item));

    ingredientList.innerHTML = filterSelected(ingredients, "ingredients")
        .map(ing => `<li class="dropdown-item">${ing}</li>`).join('');
    applianceList.innerHTML = filterSelected(appliances, "appliances")
        .map(app => `<li class="dropdown-item">${app}</li>`).join('');
    utensilList.innerHTML = filterSelected(utensils, "utensils")
        .map(ut => `<li class="dropdown-item">${ut}</li>`).join('');
};

/**
 * Filters items in a dropdown list based on user input.
 *
 * @param {string} inputSelector - The CSS selector for the input field.
 * @param {string} listSelector - The CSS selector for the dropdown list.
 */
const filterDropdownList = (inputSelector, listSelector) => {
    const input = document.querySelector(inputSelector);
    const list = document.querySelector(listSelector);

    input.addEventListener('input', () => {
        const searchTerm = input.value.toLowerCase();
        const items = list.querySelectorAll('.dropdown-item');

        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
};

/**
 * Adds a tag to the specified category and updates the UI.
 *
 * @param {string} tagText - The text content of the tag to be added.
 * @param {string} category - The category to which the tag belongs (e.g., ingredients, appliances).
 * @param {function} updateCallback - Callback function to invoke after the tag is added.
 */
const addTag = (tagText, category, updateCallback) => {
    if (!category) {
        console.error("Cannot add tag: category is undefined");
        return;
    }

    const tagContainer = document.querySelector(`.dropdown-section[data-category="${category}"] .dropdown-tags`);
    if (!tagContainer) {
        console.error("Tag container not found for category:", category);
        return;
    }

    const existingTag = Array.from(tagContainer.children).find(tag => tag.textContent.trim() === tagText);
    if (existingTag) return;

    const tag = document.createElement('li');
    tag.textContent = tagText;
    tag.setAttribute('data-value', tagText);

    const removeIcon = document.createElement('img');
    removeIcon.src = './assets/icons/cross.svg';
    removeIcon.alt = 'Remove Tag';
    removeIcon.addEventListener('click', () => {
        tag.remove();

        const relatedSelection = document.querySelector(`.dropdown-selections li[data-value="${tagText}"]`);
        if(relatedSelection) relatedSelection.remove();

        updateCallback();
    });
    tag.appendChild(removeIcon);
    tagContainer.appendChild(tag);

    updateCallback();
};

/**
 * Initializes dropdown menus for ingredients, appliances, and utensils.
 *
 * This function:
 * - Populates dropdown lists based on the provided recipes.
 * - Sets up input filtering for dropdowns.
 * - Adds click event listeners to dropdown items to handle user interactions, avoiding duplicate listeners.
 *
 * @param {Array<Object>} recipes - The array of recipe objects to populate dropdown lists.
 * @param {function} updateCallback - A callback function to update the interface/state after dropdown interactions.
 */
export const initializeDropdowns = (recipes, updateCallback) => {
    populateDropdownLists(recipes, selectedItems);

    filterDropdownList('#search-ingredients', '.dropdown-ingredients');
    filterDropdownList('#search-appliance', '.dropdown-appliances');
    filterDropdownList('#search-utensils', '.dropdown-utensils');

    document.querySelectorAll('.dropdown-list').forEach(list => {
        if (list.dataset.listenerAdded === "true") {
            console.log("Listener already added for:", list);
            return;
        }

        list.dataset.listenerAdded = "true";

        list.addEventListener('click', (e) => {
            e.stopPropagation();

            const dropdownItem = e.target.closest('.dropdown-item');

            const dropdownSection = dropdownItem?.closest('.dropdown-section');

            if (!dropdownSection) {
                console.error("Dropdown section not found for:", dropdownItem);
                return;
            }

            const category = dropdownSection.dataset.category;

            handleDropdownItemClick(dropdownItem, dropdownSection, recipes, updateCallback);

            addTag(e.target.textContent, category, updateCallback);
        });
    });
};

/**
 * Handles the click event for a dropdown item and updates the UI and state accordingly.
 *
 * This function:
 * - Adds the selected item to the respective category's selected items.
 * - Updates the dropdown lists to remove the selected item.
 * - Creates a new list element in the "selections" area of the dropdown with the chosen item.
 * - Adds a delete button to allow users to remove the selected item.
 * - Updates the UI and re-populates the dropdowns when an item is removed.
 *
 * @param {HTMLElement} dropdownItem - The clicked dropdown item element.
 * @param {HTMLElement} dropdownSection - The parent section of the dropdown, used to identify the category.
 * @param {Array<Object>} recipes - The list of recipes used to re-populate the dropdowns.
 * @param {function} updateCallback - A callback function triggered to update the state/UI when selections change.
 */
const handleDropdownItemClick = (dropdownItem, dropdownSection, recipes, updateCallback) => {
    const category = dropdownSection.dataset.category;
    const itemText = dropdownItem.textContent.trim();

    selectedItems[category].add(itemText);
    populateDropdownLists(recipes, selectedItems);

    const selectionsList = dropdownSection.querySelector('.dropdown-selections');
    const selectedItem = document.createElement('li');
    selectedItem.classList.add('dropdown-selection');
    selectedItem.textContent = itemText;
    selectedItem.setAttribute('data-value', itemText);

    const removeIcon = document.createElement('img');
    removeIcon.src = './assets/icons/round-cross.svg';
    removeIcon.alt = 'Remove selection';
    removeIcon.addEventListener('click', () => {
        selectedItem.remove();

        const relatedTag = document.querySelector(`.dropdown-tags li[data-value="${itemText}"]`);
        if(relatedTag) relatedTag.remove();

        selectedItems[category].delete(itemText);
        populateDropdownLists(recipes, selectedItems);

        updateCallback();
    });

    selectedItem.appendChild(removeIcon);
    selectionsList.appendChild(selectedItem);

    dropdownItem.remove();
};


