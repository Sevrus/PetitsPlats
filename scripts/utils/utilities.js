/**
 * Sanitizes the input from an event by removing all non-alphabetic characters.
 *
 * This function ensures that only letters and spaces remain in the input field's value.
 * The modified value is directly applied to the input field and also returned.
 *
 * @param {Event} event - The input event triggered by a user typing in an input field.
 * @returns {string} The sanitized input string containing only letters and spaces.
 */
export const sanitizedInput = (event) => {
    let sanitizedInput = event.target.value.replace(/[^a-zA-Z ]/g, "");
    event.target.value = sanitizedInput;
    return sanitizedInput;
};

export const updateErrorMessage = (mainSearchInput, filteredRecipes) => {
    const targetErrorMessage = document.querySelector(".error-message");

    if (mainSearchInput.length > 0 && mainSearchInput.length < 3) {
        targetErrorMessage.textContent = "Veuillez entrer au moins 3 caractères.";
        targetErrorMessage.style.display = "block";
    } else if (filteredRecipes.length < 1 && mainSearchInput.length > 2) {
        targetErrorMessage.textContent = `Aucune recette ne contient '${mainSearchInput}'. Essayez « tarte aux pommes », « poisson », etc.`;
        targetErrorMessage.style.display = "block";
    } else {
        targetErrorMessage.textContent = "";
        targetErrorMessage.style.display = "none";
    }
}

export const selectedItems = {
    ingredients: new Set(),
    appliances: new Set(),
    utensils: new Set(),
};
