/**
 * Filters recipes based on the main search term using traditional loops.
 *
 * @param {Array<Object>} recipes - An array of recipe objects to be searched.
 * @param {string} searchTerm - The search term used to filter the recipes.
 * @returns {Array<Object>} - An array of filtered recipe objects.
 */
export const filterRecipesByMainSearch = (recipes, searchTerm) => {
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    const filteredRecipes = [];
    let index = 0;

    for (const recipe of recipes) {
        let match = false;

        if (recipe["name"].toLowerCase().includes(lowerSearchTerm)) {
            match = true;
        }

        if (!match && recipe["description"].toLowerCase().includes(lowerSearchTerm)) {
            match = true;
        }

        if (!match) {
            for (const ingredient of recipe["ingredients"]) {
                if (ingredient["ingredient"].toLowerCase().includes(lowerSearchTerm)) {
                    match = true;
                    break;
                }
            }
        }

        if (match) {
            filteredRecipes[index] = recipe;
            index++
        }
    }

    return filteredRecipes;
};