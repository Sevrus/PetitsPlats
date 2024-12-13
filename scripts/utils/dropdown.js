/**
 * Initializes the mechanics for dropdown menus.
 *
 * This function enables toggling dropdown menus open and closed when clicking on headers.
 *  * It also ensures that clicking outside any dropdown closes all open dropdowns.
 *
 * @param {NodeListOf<Element>} targetDropdownHeaders - A collection of dropdown header elements.
 * Each header should be a direct child of a dropdown parent container.
 */
export const initializeDropdownsMechanics = (targetDropdownHeaders) => {
    const toggleDropdown = (dropdownHeader) => {
        const parentDropdown = dropdownHeader.parentElement;

        if (parentDropdown.classList.contains('open')) {
            parentDropdown.classList.remove('open');
        } else {
            closeAllDropdowns();
            parentDropdown.classList.add('open');
        }
    };

    /**
     * Closes all open dropdown menus.
     *
     * This function selects all elements with the `dropdown` class and the `open` class,
     * then removes the `open` class from each of them to ensure all dropdowns are closed.
     */
    const closeAllDropdowns = () => {
        document.querySelectorAll('.dropdown.open').forEach((dropdown) => {
            dropdown.classList.remove('open');
        });
    };

    targetDropdownHeaders.forEach(targetDropdownHeader => {
        targetDropdownHeader.addEventListener('click', e => {
            e.stopPropagation();
            toggleDropdown(targetDropdownHeader);
        });
    });

    document.addEventListener('click', () => {
        closeAllDropdowns();
    });

    document.querySelectorAll(".dropdown-content").forEach(dropdownContent => {
        dropdownContent.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    });
};