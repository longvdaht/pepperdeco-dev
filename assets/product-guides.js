document.addEventListener("DOMContentLoaded", function() {
    const tabTitles = document.querySelectorAll(".product-sidebar-item");
    const tabContents = document.querySelectorAll(".product-guide-items");

    tabTitles.forEach(function(title) {
        title.addEventListener("click", function() {
        const tabId = title.getAttribute("data-sidebar");

        tabTitles.forEach(function(title) {
            title.classList.remove("active");
        });
        title.classList.add("active");

        tabContents.forEach(function(content) {
            content.classList.remove("active");
            if (content.getAttribute("id") === tabId) {
            content.classList.add("active");
            }
        });
        });
    });

    // Activate the first tab by default
    if (tabTitles.length > 0) {
        tabTitles[0].click();
    }
});