import { fetchData } from "./services/api.js";
import {filterRecipesByAdvancedSearch, initializeDropdowns} from "./services/searchFunctions.js";
import { generateRecipeCards } from "./views/listOfRecipesView.js";
import {filterRecipesByMainSearch} from "./prototypes/searchAlgorithms.js";

fetchData('./data/recipes.json').then(recipes => {
    const mainSearchInput = document.getElementById("global-search");
    const targetErrorMessage = document.querySelector(".error-message");
    const targetGlobalSearchCross = document.querySelector(".global-search-cross");
    const targetDropdownHeaders = document.querySelectorAll(".dropdown-header");
    const targetGlobalSearch = document.querySelector("#global-search");

    targetGlobalSearch.addEventListener("input", (e) => {
        let sanitizedInput = e.target.value.replace(/[^a-zA-Z ]/g, "");
        e.target.value = sanitizedInput;

        if (sanitizedInput.length < 3) {
            targetErrorMessage.textContent = "Veuillez entrer au moins 3 caractères.";
            targetGlobalSearchCross.style.display = "none";
        } else {
            targetErrorMessage.textContent = "";
            targetGlobalSearchCross.style.display = "block";
        }

        targetGlobalSearchCross.addEventListener("click", () => {
            e.target.value = "";
            targetGlobalSearchCross.style.display = "none";
        });
    });

    targetDropdownHeaders.forEach(targetDropdownHeader => {
        targetDropdownHeader.addEventListener("click", () => {
            if (targetDropdownHeader.parentElement.classList.contains("open")) {
                targetDropdownHeader.parentElement.classList.remove("open");

            } else {
                targetDropdownHeader.parentElement.classList.add("open");
            }
        });
    });

    // Initialiser les listes déroulantes et les événements associés
    initializeDropdowns(recipes, () => {
        // Fonction de mise à jour appelée lors des interactions
        let filteredRecipes = filterRecipesByMainSearch(recipes, document.getElementById("global-search").value.trim());
        const selectedTags = getSelectedTags();
        filteredRecipes = filterRecipesByAdvancedSearch(filteredRecipes, selectedTags.ingredients, selectedTags.appliances, selectedTags.utensils);
        generateRecipeCards(filteredRecipes);
    });

    // Gestion du champ principal
    mainSearchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value.trim();

        // Validation du champ
        if (searchTerm.length < 3) {
            targetErrorMessage.textContent = "Veuillez entrer au moins 3 caractères.";
            targetGlobalSearchCross.style.display = "none";
            generateRecipeCards(recipes); // Réinitialiser les résultats
            return;
        } else {
            targetErrorMessage.textContent = "";
            targetGlobalSearchCross.style.display = "block";
        }

        // Supprimer la recherche
        targetGlobalSearchCross.addEventListener("click", () => {
            e.target.value = "";
            targetGlobalSearchCross.style.display = "none";
            generateRecipeCards(recipes); // Réinitialiser les résultats
        });

        // Appliquer le filtrage
        let filteredRecipes = filterRecipesByMainSearch(recipes, searchTerm);
        const selectedTags = getSelectedTags();
        filteredRecipes = filterRecipesByAdvancedSearch(filteredRecipes, selectedTags.ingredients, selectedTags.appliances, selectedTags.utensils);
        generateRecipeCards(filteredRecipes);
    });

    generateRecipeCards(recipes); // Afficher toutes les recettes initialement
});

// Fonction pour récupérer les tags sélectionnés
const getSelectedTags = () => {
    return {
        ingredients: Array.from(document.querySelectorAll('.dropdown-section[data-category="ingredients"] .dropdown-tags li')).map(tag => tag.textContent.trim()),
        appliances: Array.from(document.querySelectorAll('.dropdown-section[data-category="appliances"] .dropdown-tags li')).map(tag => tag.textContent.trim()),
        utensils: Array.from(document.querySelectorAll('.dropdown-section[data-category="utensils"] .dropdown-tags li')).map(tag => tag.textContent.trim())
    };
};
