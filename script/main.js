const targetDropdownHeaders = document.querySelectorAll('.dropdown-header');

targetDropdownHeaders.forEach(targetDropdownHeader => {
    targetDropdownHeader.addEventListener('click', () => {
        if (targetDropdownHeader.parentElement.classList.contains('open')) {
            targetDropdownHeader.parentElement.classList.remove('open');

        } else {
            targetDropdownHeader.parentElement.classList.add('open');
        }
    })
})