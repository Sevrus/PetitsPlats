import {selectedItems} from "../utils/utilities.js";

/**
 *
 * @param recipes
 * @param selectedIngredients
 * @param selectedAppliances
 * @param selectedUtensils
 * @returns {*}
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
 *
 * @param recipes
 * @param selectedItems
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
 *
 * @param inputSelector
 * @param listSelector
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
 *
 * @param tagText
 * @param category
 * @param updateCallback
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
 *
 * @param recipes
 * @param updateCallback
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


