import { fetchData } from "./services/api.js";
import {filterRecipesByAdvancedSearch, initializeDropdowns, populateDropdownLists} from "./services/searchFunctions.js";
import { generateRecipeCards } from "./views/listOfRecipesView.js";
import {filterRecipesByMainSearch} from "./prototypes/searchAlgorithms.js";

fetchData('./data/recipes.json').then(recipes => {
    const mainSearchInput = document.getElementById("global-search");
    const targetErrorMessage = document.querySelector(".error-message");
    const targetGlobalSearchCross = document.querySelector(".global-search-cross");
    const targetDropdownHeaders = document.querySelectorAll(".dropdown-header");

    mainSearchInput.addEventListener("input", (e) => {
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
            updateRecipes();
        });
    });

    /**
     *
     */
    const updateRecipes = () => {
        let filteredRecipes = [...recipes];

        const mainSearchInput = document.getElementById("global-search").value.trim();
        filteredRecipes = filterRecipesByMainSearch(filteredRecipes, mainSearchInput);

        const selectedTags = getSelectedTags();
        filteredRecipes = filterRecipesByAdvancedSearch(
            filteredRecipes,
            selectedTags.ingredients,
            selectedTags.appliances,
            selectedTags.utensils
        );

        generateRecipeCards(filteredRecipes);
        populateDropdownLists(filteredRecipes);
    };

    initializeDropdowns(recipes, updateRecipes);

    document.getElementById('global-search').addEventListener('input', () => {
        updateRecipes();
    });

    generateRecipeCards(recipes);

    /**
     *
     * @returns {{ingredients: string[], appliances: string[], utensils: string[]}}
     */
    const getSelectedTags = () => {
        return {
            ingredients: Array.from(document.querySelectorAll('.dropdown-section[data-category="ingredients"] .dropdown-tags li')).map(tag => tag.textContent.trim()),
            appliances: Array.from(document.querySelectorAll('.dropdown-section[data-category="appliances"] .dropdown-tags li')).map(tag => tag.textContent.trim()),
            utensils: Array.from(document.querySelectorAll('.dropdown-section[data-category="utensils"] .dropdown-tags li')).map(tag => tag.textContent.trim())
        };
    };

    targetDropdownHeaders.forEach(targetDropdownHeader => {
        targetDropdownHeader.addEventListener("click", () => {
            if (targetDropdownHeader.parentElement.classList.contains("open")) {
                targetDropdownHeader.parentElement.classList.remove("open");

            } else {
                targetDropdownHeader.parentElement.classList.add("open");
            }
        });
    });

    /**
     *
     */
    initializeDropdowns(recipes, () => {
        let filteredRecipes = filterRecipesByMainSearch(recipes, document.getElementById("global-search").value.trim());
        const selectedTags = getSelectedTags();
        filteredRecipes = filterRecipesByAdvancedSearch(filteredRecipes, selectedTags.ingredients, selectedTags.appliances, selectedTags.utensils);
        generateRecipeCards(filteredRecipes);
    });
});
