export const generateRecipeCards = (recipes) => {
  const container = document.querySelector(".recipe-list");
  const recipeCountElement = document.getElementById("recipe-count");

  container.innerHTML = '';

  recipeCountElement.textContent = recipes.length;

  recipes.forEach((recipe) => {
      const recipeCard = document.createElement("article");
      recipeCard.classList.add("recipe-card");

      const recipeTime = document.createElement("span");
      recipeTime.classList.add("recipe-time");
      recipeTime.textContent = `${recipe["time"]}min`;

      const recipeImage = document.createElement("img");
      recipeImage.classList.add("recipe-img");
      recipeImage.src = `./assets/images/recipes/${recipe["image"]}`;
      recipeImage.alt = recipe.name;

      const recipeContainer = document.createElement("div");
      recipeContainer.classList.add("recipe-container");

      const recipeTitle = document.createElement("h2");
      recipeTitle.classList.add("recipe-title");
      recipeTitle.textContent = recipe["name"];

      const recipeDescriptionTitle = document.createElement('h3');
      recipeDescriptionTitle.textContent = 'Recette';

      const recipeDescription = document.createElement('p');
      recipeDescription.textContent = recipe["description"];

      const ingredientsTitle = document.createElement('h3');
      ingredientsTitle.textContent = 'Ingrédients';

      const ingredientsList = document.createElement('ul');
      ingredientsList.classList.add("ingredient-list");

      recipe["ingredients"].forEach((item) => {
          const ingredientItem = document.createElement('li');
          const ingredientText = document.createElement('span');
          ingredientText.classList.add('quantity');

          ingredientItem.textContent = item["ingredient"];
          if (item["quantity"]) {
              ingredientText.textContent = `${item["quantity"]}${item["unit"] || ''}`;
              ingredientItem.appendChild(ingredientText);
          }

          ingredientsList.appendChild(ingredientItem);
      });

      recipeCard.appendChild(recipeTime);
      recipeCard.appendChild(recipeImage);
      recipeCard.appendChild(recipeTitle);
      recipeCard.appendChild(recipeContainer);
      recipeContainer.appendChild(recipeDescriptionTitle);
      recipeContainer.appendChild(recipeDescription);
      recipeContainer.appendChild(ingredientsTitle);
      recipeContainer.appendChild(ingredientsList);
      container.appendChild(recipeCard);
  });
}