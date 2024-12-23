/**
 * Filters recipes based on the main search term using modern array methods.
 *
 * @param {Array<Object>} recipes - An array of recipe objects to be searched.
 * @param {string} searchTerm - The search term used to filter the recipes.
 * @returns {Array<Object>} - An array of filtered recipe objects.
 */
export const filterRecipesByMainSearch = (recipes, searchTerm) => {
    return recipes.filter(recipe => {
        const inTitle = recipe["name"].toLowerCase().includes(searchTerm.toLowerCase());
        const inDescription = recipe["description"].toLowerCase().includes(searchTerm.toLowerCase());

        const inIngredients = recipe["ingredients"].some(ingredient =>
            ingredient["ingredient"].toLowerCase().includes(searchTerm.toLowerCase())
        );

        return inTitle || inDescription || inIngredients;
    });
};