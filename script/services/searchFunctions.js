// Fonction pour gérer la recherche principale et la recherche avancée
const handleSearch = (recipes) => {
    const mainSearchInput = document.getElementById('main-search');
    const ingredientSearch = document.getElementById('ingredient-search');
    const applianceSearch = document.getElementById('appliance-search');
    const utensilSearch = document.getElementById('utensil-search');

    mainSearchInput.addEventListener('input', () => {
        const searchTerm = mainSearchInput.value;

        // Filtrer les recettes en fonction du champ principal
        let filteredRecipes = filterRecipesByMainSearch(recipes, searchTerm);

        // Appliquer les filtres de recherche avancée
        const selectedIngredient = ingredientSearch.value;
        const selectedAppliance = applianceSearch.value;
        const selectedUtensil = utensilSearch.value;

        filteredRecipes = filterRecipesByAdvancedSearch(
            filteredRecipes,
            selectedIngredient,
            selectedAppliance,
            selectedUtensil
        );

        // Mettre à jour l'affichage des recettes
        updateRecipeDisplay(filteredRecipes);

        // Actualiser les options des champs de recherche avancée en fonction des résultats filtrés
        populateAdvancedSearchFields(filteredRecipes);
    });

    // Gérer les changements dans les champs de recherche avancée
    ingredientSearch.addEventListener('change', () => {
        handleAdvancedSearchUpdate(recipes);
    });
    applianceSearch.addEventListener('change', () => {
        handleAdvancedSearchUpdate(recipes);
    });
    utensilSearch.addEventListener('change', () => {
        handleAdvancedSearchUpdate(recipes);
    });
};

// Fonction pour gérer la mise à jour des recherches avancées après sélection
const handleAdvancedSearchUpdate = (recipes) => {
    const searchTerm = document.getElementById('main-search').value;
    const selectedIngredient = document.getElementById('ingredient-search').value;
    const selectedAppliance = document.getElementById('appliance-search').value;
    const selectedUtensil = document.getElementById('utensil-search').value;

    // Filtrer les recettes en fonction de la recherche principale
    let filteredRecipes = filterRecipesByMainSearch(recipes, searchTerm);

    // Appliquer les filtres de recherche avancée
    filteredRecipes = filterRecipesByAdvancedSearch(
        filteredRecipes,
        selectedIngredient,
        selectedAppliance,
        selectedUtensil
    );

    // Mettre à jour l'affichage des recettes
    updateRecipeDisplay(filteredRecipes);
};

// Fonction pour afficher les recettes filtrées
const updateRecipeDisplay = (filteredRecipes) => {
    const recipeResultsContainer = document.getElementById('recipe-results');
    recipeResultsContainer.innerHTML = '';

    filteredRecipes.forEach(recipe => {
        // Afficher les recettes dans l'interface utilisateur
        const recipeElement = document.createElement('div');
        recipeElement.textContent = recipe.name;
        recipeResultsContainer.appendChild(recipeElement);
    });
};

// Appel de l'API ou du fichier JSON
fetchData('path/to/recipes.json').then(recipes => {
    handleSearch(recipes);
});