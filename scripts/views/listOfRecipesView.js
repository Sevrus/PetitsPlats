/**
 * Renders and displays a list of recipe cards.
 *
 * @param {Array<Object>} recipes - An array of recipe objects to be displayed.
 */
export const generateRecipeCards = (recipes) => {
  const container = document.querySelector(".recipe-list");
  const recipeCountElement = document.getElementById("recipe-count");

  container.innerHTML = '';

  recipeCountElement.textContent = recipes.length;

    recipes.forEach((recipe) => {
        const recipeCard = document.createElement("article");
        recipeCard.classList.add("recipe-card");

        recipeCard.innerHTML = `
      <span class="recipe-time">${recipe["time"]} min</span>
      <img class="recipe-img" src="./assets/images/recipes/${recipe["image"]}" alt="${recipe["name"]}">
      <h2 class="recipe-title">${recipe["name"]}</h2>
      <div class="recipe-container">
        <h3>Recette</h3>
        <p>${recipe["description"]}</p>
        <h3>Ingrédients</h3>
        <ul class="ingredient-list">
          ${recipe["ingredients"].map(item => `
            <li>${item["ingredient"]}${item["quantity"] ? ` : <span>${item["quantity"]} ${item["unit"] || ''}</span>` : ''}</li>
          `).join('')}
        </ul>
      </div>
    `;

        container.appendChild(recipeCard);
    });
}