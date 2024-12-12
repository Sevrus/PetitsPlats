/**
 * Filters recipes based on the main search term using modern array methods.
 *
 * @param {Array<Object>} recipes - An array of recipe objects to be searched.
 * @param {string} searchTerm - The search term used to filter the recipes.
 * @returns {Array<Object>} - An array of filtered recipe objects.
 */
const filterRecipesByMainSearch = (recipes, searchTerm) => {
    if (searchTerm.length < 3) return recipes;

    return recipes.filter(recipe => {
        const inTitle = recipe["name"].toLowerCase().includes(searchTerm.toLowerCase());
        const inDescription = recipe["description"].toLowerCase().includes(searchTerm.toLowerCase());

        const inIngredients = recipe["ingredients"].some(ingredient =>
            ingredient["ingredient"].toLowerCase().includes(searchTerm.toLowerCase())
        );

        return inTitle || inDescription || inIngredients;
    });
};

/**
 * Filters recipes based on the main search term using traditional loops.
 *
 * @param {Array<Object>} recipes - An array of recipe objects to be searched.
 * @param {string} searchTerm - The search term used to filter the recipes.
 * @returns {Array<Object>} - An array of filtered recipe objects.
 */
const searchRecipesWithLoops = (recipes, searchTerm) => {
    if (searchTerm.length < 3) return recipes;

    const filteredRecipes = [];
    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        const lowerSearchTerm = searchTerm.toLowerCase();

        let match = false;

        if (recipe["name"].toLowerCase().includes(lowerSearchTerm)) {
            match = true;
        }

        if (!match && recipe["description"].toLowerCase().includes(lowerSearchTerm)) {
            match = true;
        }

        if (!match) {
            for (let j = 0; j < recipe["ingredients"].length; j++) {
                const ingredient = recipe["ingredients"][j]["ingredient"].toLowerCase();
                if (ingredient.includes(lowerSearchTerm)) {
                    match = true;
                    break;
                }
            }
        }

        if (match) {
            filteredRecipes.push(recipe);
        }
    }

    return filteredRecipes;
};

export { searchRecipesWithLoops, filterRecipesByMainSearch };
