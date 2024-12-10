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
 */
export const populateDropdownLists = (recipes) => {
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

    ingredientList.innerHTML = Array.from(ingredients).map(ing => `<li class="dropdown-item">${ing}</li>`).join('');
    applianceList.innerHTML = Array.from(appliances).map(app => `<li class="dropdown-item">${app}</li>`).join('');
    utensilList.innerHTML = Array.from(utensils).map(ut => `<li class="dropdown-item">${ut}</li>`).join('');
};

/**
 *
 * @param inputSelector
 * @param listSelector
 */
export const filterDropdownList = (inputSelector, listSelector) => {
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
export const addTag = (tagText, category, updateCallback) => {
    if (!category) {
        console.error("Cannot add tag: category is undefined");
        return;
    }

    const tagContainer = document.querySelector(`.dropdown-section[data-category="${category}"] .dropdown-tags`);
    if (!tagContainer) {
        console.error("Tag container not found for category:", category);
        return;
    }

    // Vérifier si le tag existe déjà
    const existingTag = Array.from(tagContainer.children).find(tag => tag.textContent.trim() === tagText);
    if (existingTag) return;

    // Ajouter un nouveau tag
    const tag = document.createElement('li');
    tag.textContent = tagText;
    const removeIcon = document.createElement('img');
    removeIcon.src = './assets/icons/cross.svg';
    removeIcon.alt = 'Remove Tag';
    removeIcon.addEventListener('click', () => {
        tag.remove();
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
    populateDropdownLists(recipes);

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
            console.log("Resolved dropdown item:", dropdownItem);

            const dropdownSection = dropdownItem?.closest('.dropdown-section');
            console.log("Resolved dropdown-section:", dropdownSection);

            if (!dropdownSection) {
                console.error("Dropdown section not found for:", dropdownItem);
                return;
            }

            const category = dropdownSection.dataset.category;
            console.log("Resolved category:", category);



            // Ajouter l'élément à la bonne dropdown-selections
            const selectionsList = document.querySelector(`.dropdown-section[data-category="${category}"] .dropdown-selections`);
            const selectedItem = document.createElement('li');
            selectedItem.classList.add('dropdown-selection');
            selectedItem.textContent = dropdownItem.textContent;

            // Ajouter un bouton ou une icône pour supprimer l'élément
            const removeIcon = document.createElement('img');
            removeIcon.src = './assets/icons/round-cross.svg';
            removeIcon.alt = 'Remove selection';
            removeIcon.addEventListener('click', () => {
                // Réintégrer l'élément dans la dropdown-list
                dropdownItem.style.display = ''; // Réafficher l'élément dans la liste
                dropdownSection.querySelector('.dropdown-list').appendChild(dropdownItem);
                selectedItem.remove(); // Retirer l'élément de la sélection
            });
            selectedItem.appendChild(removeIcon);

            selectionsList.appendChild(selectedItem);

            // Retirer l'élément de la dropdown-list
            dropdownItem.style.display = 'none'; // Masquer l'élément

            addTag(e.target.textContent, category, updateCallback);
        });
    });
};


