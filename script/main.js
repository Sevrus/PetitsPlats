import { fetchData } from "./services/api.js";

const targetDropdownHeaders = document.querySelectorAll(".dropdown-header");
const targetRecipeCount =document.querySelector("#recipe-count");
const targetGlobalSearch = document.querySelector("#global-search");
const targetErrorMessage = document.querySelector(".error-message");
const targetGlobalSearchCross = document.querySelector(".global-search-cross");

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

fetchData("./script/data/recipes.json").then(data => {
    targetRecipeCount.textContent = `${data.length}`;
});