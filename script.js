document.addEventListener('DOMContentLoaded', () => {
    // --- THEME SWITCHER LOGIC ---
    const themeToggleButton = document.getElementById('theme-toggle');
    const body = document.body;

    const applyTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
            themeToggleButton.textContent = '☀️';
        } else {
            body.classList.remove('dark-mode');
            themeToggleButton.textContent = '🌙';
        }
    };

    themeToggleButton.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggleButton.textContent = '☀️';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggleButton.textContent = '🌙';
        }
    });

    applyTheme();

    // --- PORTFOLIO FILTER LOGIC ---
    const filtersContainer = document.getElementById('portfolio-filters');
    const portfolioLinks = document.querySelectorAll('#portfolio-grid .portfolio-link');

    if (filtersContainer && portfolioLinks.length > 0) {
        filtersContainer.addEventListener('click', (e) => {
            // Check if the clicked element is a filter link
            if (e.target.matches('.filter-link')) {
                e.preventDefault(); // Stop the link's default behavior (jumping to top)

                const filterValue = e.target.getAttribute('data-filter');

                // Update which filter link is marked as 'active'
                filtersContainer.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');

                // Loop through each portfolio item (the <a> tags)
                portfolioLinks.forEach(link => {
                    const card = link.querySelector('.portfolio-card'); // Find the article inside the link
                    const itemCategory = card.getAttribute('data-category'); // Get its category

                    // Compare the filter value with the item's category
                    // This is the crucial part that makes the logic work
                    if (filterValue === 'all' || itemCategory === filterValue) {
                        link.style.display = 'block'; // Show the link
                    } else {
                        link.style.display = 'none'; // Hide the link
                    }
                });
            }
        });
    }
});