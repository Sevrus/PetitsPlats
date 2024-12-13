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

  document.addEventListener('click', e => {
      closeAllDropdowns();
  });
};