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

    // --- SERVICES SLIDER LOGIC ---
    const slider = document.getElementById('services-slider');
    const dotsContainer = document.getElementById('slider-dots');
    
    if (slider && dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.dot');
        dotsContainer.addEventListener('click', (e) => {
            if (e.target.matches('.dot')) {
                const slideToGo = e.target.dataset.slide;
                const transformValue = slideToGo * -50;
                slider.style.transform = `translateX(${transformValue}%)`;
                dots.forEach(dot => dot.classList.remove('active'));
                e.target.classList.add('active');
            }
        });
    }

    // --- NEW: PORTFOLIO FILTER LOGIC ---
    const filtersContainer = document.getElementById('portfolio-filters');
    const portfolioItems = document.querySelectorAll('#portfolio-grid .portfolio-card');

    if (filtersContainer && portfolioItems.length > 0) {
        filtersContainer.addEventListener('click', (e) => {
            e.preventDefault(); // Stop the link from jumping the page

            // Only run if a filter link was clicked
            if (e.target.matches('.filter-link')) {
                const filterValue = e.target.getAttribute('data-filter');

                // Update active state on filter links
                filtersContainer.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');

                // Loop through all portfolio items
                portfolioItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    
                    // If the filter is 'all' OR the item's category matches the filter, show it. Otherwise, hide it.
                    if (filterValue === 'all' || itemCategory === filterValue) {
                        item.classList.remove('hide');
                    } else {
                        item.classList.add('hide');
                    }
                });
            }
        });
    }
});