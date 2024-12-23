import {fetchData} from "./services/api.js";
import {filterRecipesByAdvancedSearch, initializeDropdowns, populateDropdownLists} from "./services/searchFunctions.js";
import {generateRecipeCards} from "./views/listOfRecipesView.js";
import {sanitizedInput, selectedItems, updateErrorMessage} from "./utils/utilities.js";
import {initializeDropdownsMechanics} from "./utils/dropdown.js";
import {filterRecipesByMainSearch} from "./prototypes/filterRecipes.js";

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
        const sanitizedValue = sanitizedInput(e);

        if (sanitizedValue.length > 0) {
            targetGlobalSearchCross.style.display = "block";
        } else {
            targetGlobalSearchCross.style.display = "none";
        }

        updateRecipes();
    });

    targetGlobalSearchCross.addEventListener("click", () => {
        mainSearchInput.value = "";
        targetGlobalSearchCross.style.display = "none";
        targetErrorMessage.textContent = "";

        updateRecipes();
    });

    /**
     * Updates the list of displayed recipes based on the global search input,
     * selected tags, and advanced search criteria.
     */
    const updateRecipes = () => {
        const mainSearchInput = document.getElementById("global-search").value.trim();

        let filteredRecipes = [...recipes];
        const selectedTags = getSelectedTags();

        if(mainSearchInput.length >= 3) {
            filteredRecipes = filterRecipesByMainSearch(filteredRecipes, mainSearchInput);
        }

        filteredRecipes = filterRecipesByAdvancedSearch(
            filteredRecipes,
            selectedTags.ingredients,
            selectedTags.appliances,
            selectedTags.utensils
        );

        updateErrorMessage(mainSearchInput, filteredRecipes);

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

    initializeDropdownsMechanics(targetDropdownHeaders);

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
