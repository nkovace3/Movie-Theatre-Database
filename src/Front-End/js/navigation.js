document.addEventListener("DOMContentLoaded", function () {
    // Get the current page URL
    var pathArray = window.location.pathname.split('/');
    var currentPage = pathArray[pathArray.length - 1];

    // Remove 'active' class from all links
    var navLinks = document.querySelectorAll('#navList a');
    navLinks.forEach(function (link) {
        link.classList.remove('active');
    });

    // Add 'active' class to the current page link
    var currentLink = document.querySelector('a[href="' + currentPage + '"]');
    if (currentLink) {
        currentLink.classList.add('active');
    }
});
