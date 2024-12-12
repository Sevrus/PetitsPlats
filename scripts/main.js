import { fetchData } from "./services/api.js";
import {filterRecipesByAdvancedSearch, initializeDropdowns, populateDropdownLists} from "./services/searchFunctions.js";
import { generateRecipeCards } from "./views/listOfRecipesView.js";
import {filterRecipesByMainSearch} from "./prototypes/searchAlgorithms.js";
import {sanitizedInput, selectedItems} from "./utils/utilities.js";

/**
 * Initializes the application by fetching recipe data, setting up event listeners
 * for global and advanced searches, and generating recipe cards.
 */
fetchData('./data/recipes.json').then(recipes => {
    const mainSearchInput = document.getElementById("global-search");
    const targetErrorMessage = document.querySelector(".error-message");
    const targetGlobalSearchCross = document.querySelector(".global-search-cross");
    const targetDropdownHeaders = document.querySelectorAll(".dropdown-header");

    /**
     * Adds an event listener to the global search bar to handle user input.
     * Validates the input length and updates the filtered recipe list.
     */
    mainSearchInput.addEventListener("input", (e) => {

        if (sanitizedInput(e).length > 0 && sanitizedInput(e).length < 3) {
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
     * Updates the list of displayed recipes based on the global search input,
     * selected tags, and advanced search criteria.
     */
    const updateRecipes = () => {
        let filteredRecipes = [...recipes];
        const mainSearchInput = document.getElementById("global-search").value.trim();
        const selectedTags = getSelectedTags();

        filteredRecipes = filterRecipesByMainSearch(filteredRecipes, mainSearchInput);

        filteredRecipes = filterRecipesByAdvancedSearch(
            filteredRecipes,
            selectedTags.ingredients,
            selectedTags.appliances,
            selectedTags.utensils
        );

        if (filteredRecipes.length < 1) {
            targetErrorMessage.textContent = `Aucune recette ne contient '${mainSearchInput}'. Essayez « tarte aux pommes », « poisson », etc.`;
            targetErrorMessage.style.display = "block";
        } else {
            targetErrorMessage.textContent = "";
            targetErrorMessage.style.display = "none";
        }

        generateRecipeCards(filteredRecipes);
    };

    initializeDropdowns(recipes, updateRecipes);

    document.getElementById('global-search').addEventListener('input', () => {
        updateRecipes();
    });

    generateRecipeCards(recipes);

    /**
     * Retrieves selected tags from dropdowns (ingredients, appliances, and utensils).
     *
     * @returns {{ingredients: string[], appliances: string[], utensils: string[]}}
     *          An object containing arrays of selected tags for each category.
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
     * Initializes dropdowns with the ability to filter recipes using advanced search.
     * Synchronizes dropdown selections with the displayed recipes.
     */
    initializeDropdowns(recipes, () => {
        populateDropdownLists(recipes, selectedItems);
        let filteredRecipes = filterRecipesByMainSearch(recipes, document.getElementById("global-search").value.trim());
        const selectedTags = getSelectedTags();
        filteredRecipes = filterRecipesByAdvancedSearch(filteredRecipes, selectedTags.ingredients, selectedTags.appliances, selectedTags.utensils);
        generateRecipeCards(filteredRecipes);
    });
});
