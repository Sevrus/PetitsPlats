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

// Mise à jour des listes déroulantes
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

// Gestion des filtres dans les listes déroulantes
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

// Gestion des tags
export const addTag = (tagText, category, updateCallback) => {
    const tagContainer = document.querySelector(`.dropdown-section[data-category="${category}"] .dropdown-tags`);

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

// Initialisation des listes déroulantes
export const initializeDropdowns = (recipes, updateCallback) => {
    populateDropdownLists(recipes);

    // Appliquer le filtrage dynamique sur les champs de recherche des listes déroulantes
    filterDropdownList('#search-ingredients', '#search-ingredients + .dropdown-list');
    filterDropdownList('#search-appliance', '#search-appliance + .dropdown-list');
    filterDropdownList('#search-utensils', '#search-utensils + .dropdown-list');

    // Gestion des clics sur les items des listes déroulantes
    document.querySelectorAll('.dropdown-list').forEach(list => {
        list.addEventListener('click', (e) => {
            if (e.target.classList.contains('dropdown-item')) {
                const category = e.target.closest('.dropdown-section').dataset.category;
                addTag(e.target.textContent, category, updateCallback);
            }
        });
    });
};


