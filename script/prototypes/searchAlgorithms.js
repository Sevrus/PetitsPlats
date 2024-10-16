// Recherche avec les méthodes modernes (filter, some, includes)
const searchRecipes = (recipes, searchTerm) => {
    if (searchTerm.length < 3) return []; // Lancer la recherche à partir de 3 caractères

    // Filtrer les recettes en fonction du titre, description, ou ingrédients
    return recipes.filter(recipe => {
        const inTitle = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
        const inDescription = recipe.description.toLowerCase().includes(searchTerm.toLowerCase());

        // Vérifie si un ingrédient contient le terme recherché
        const inIngredients = recipe.ingredients.some(ingredient =>
            ingredient.ingredient.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return inTitle || inDescription || inIngredients;
    });
};

// Recherche avec des boucles traditionnelles (for, if)
const searchRecipesWithLoops = (recipes, searchTerm) => {
    if (searchTerm.length < 3) return []; // Recherche à partir de 3 caractères

    const filteredRecipes = [];
    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        const lowerSearchTerm = searchTerm.toLowerCase();

        let match = false;

        // Vérifier si le titre contient le terme recherché
        if (recipe.name.toLowerCase().includes(lowerSearchTerm)) {
            match = true;
        }

        // Vérifier si la description contient le terme recherché
        if (!match && recipe.description.toLowerCase().includes(lowerSearchTerm)) {
            match = true;
        }

        // Vérifier si un des ingrédients contient le terme recherché
        if (!match) {
            for (let j = 0; j < recipe.ingredients.length; j++) {
                const ingredient = recipe.ingredients[j].ingredient.toLowerCase();
                if (ingredient.includes(lowerSearchTerm)) {
                    match = true;
                    break;
                }
            }
        }

        // Ajouter la recette filtrée
        if (match) {
            filteredRecipes.push(recipe);
        }
    }

    return filteredRecipes;
};
