document.addEventListener('DOMContentLoaded', () => {

    // --- THEME SWITCHER LOGIC ---
    const themeToggleButton = document.getElementById('theme-toggle');
    const body = document.body;

    /**
     * Applies the saved theme from localStorage or defaults to dark mode.
     * UPDATED TO DEFAULT DARK
     */
    const applyTheme = () => {
        const savedTheme = localStorage.getItem('theme');

        // === THIS IS THE UPDATED LOGIC ===
        // If 'light' is explicitly saved, use light mode.
        // Otherwise (no theme saved OR 'dark' saved), default to dark mode.
        if (savedTheme === 'light') {
            body.classList.remove('dark-mode');
            themeToggleButton.textContent = '🌙';
        } else {
            body.classList.add('dark-mode');
            themeToggleButton.textContent = '☀️';
            // Optionally, save 'dark' if it wasn't saved before
            if (!savedTheme) {
                 localStorage.setItem('theme', 'dark');
            }
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

    applyTheme(); // Apply theme on initial load


    // --- PORTFOLIO FILTER & AUTO-ROTATING STACK / MOBILE SLIDER LOGIC ---

    // --- Global Variables ---
    const filtersContainer = document.getElementById('portfolio-filters');
    const portfolioGrid = document.getElementById('portfolio-grid');
    const prevButton = document.getElementById('portfolio-prev');
    const nextButton = document.getElementById('portfolio-next');

    // Master list of all cards, stored in memory
    const allCardsArray = Array.from(portfolioGrid.querySelectorAll('.portfolio-link'));

    // List of CSS classes that control the desktop stack positions (0-indexed)
    const stackPositionClasses = ['stack-pos-1', 'stack-pos-2', 'stack-pos-3', 'stack-pos-4', 'stack-pos-5'];
    // The index of the "center" class (stack-pos-3)
    const cssCenterClassIndex = 2;

    // Variables to track the currently visible cards
    let currentVisibleCards = [];
    let currentMobileIndex = 0; // For mobile slider

    // --- Auto-rotate/slide timer variable ---
    let autoTimer = null;
    const autoDelay = 3000; // 3 seconds

    // --- Flag to track if mobile view is active ---
    let isMobileView = window.innerWidth <= 768;

    // --- Scroll interaction variables ---
    let isHoveringGrid = false;
    let isScrolling = false; // Throttle flag for scroll
    const scrollThrottleDelay = 300; // Milliseconds between scroll rotations


    /**
     * Updates the mobile slider by adding/removing the .active class.
     */
    function updateMobileSlider(newIndex) {
        if (currentVisibleCards.length === 0) return;

        if (currentVisibleCards[currentMobileIndex]) {
            currentVisibleCards[currentMobileIndex].classList.remove('active');
        }

        if (newIndex < 0) {
            currentMobileIndex = currentVisibleCards.length - 1;
        } else if (newIndex >= currentVisibleCards.length) {
            currentMobileIndex = 0;
        } else {
            currentMobileIndex = newIndex;
        }

        if (currentVisibleCards[currentMobileIndex]) {
            currentVisibleCards[currentMobileIndex].classList.add('active');
        }
    }


    /**
     * Calculates and applies the stack position classes based on currently visible cards.
     * ONLY RUNS ON DESKTOP.
     */
    function applyStackClasses() {
        if (isMobileView) return; // Don't apply stack classes on mobile

        const numCards = currentVisibleCards.length;
        if (numCards === 0) return;

        const centerCardIndex = Math.floor((numCards - 1) / 2);

        currentVisibleCards.forEach((card, index) => {
            stackPositionClasses.forEach(cls => card.classList.remove(cls));
            card.classList.remove('active');

            const relativeIndex = index - centerCardIndex;
            const classIndex = cssCenterClassIndex + relativeIndex;

            if (classIndex >= 0 && classIndex < stackPositionClasses.length) {
                card.classList.add(stackPositionClasses[classIndex]);
                 card.style.opacity = '';
                 card.style.transform = '';
            } else {
                 card.style.opacity = '0';
                 card.style.transform = 'translateY(60px) scale(0.6)';
            }
        });
    }

     /**
      * Rotates the stack positions by rotating the `currentVisibleCards` array
      * and then reapplying the classes. Accepts direction.
      * ONLY RUNS ON DESKTOP.
      * @param {number} direction - 1 for forward (scroll down), -1 for backward (scroll up)
      */
     function rotateStack(direction = 1) { // Default to forward
         if (isMobileView || currentVisibleCards.length < 2) return;

         if (direction === 1) {
            // Rotate Forward: Move the first element to the end
            const firstCard = currentVisibleCards.shift();
            currentVisibleCards.push(firstCard);
         } else if (direction === -1) {
            // Rotate Backward: Move the last element to the beginning
            const lastCard = currentVisibleCards.pop();
            currentVisibleCards.unshift(lastCard);
         }

         // Re-apply the CSS classes based on the new array order
         applyStackClasses();
     }


    /**
     * Function to stop the auto timer.
     */
    function stopAutoTimer() {
        if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
        }
    }

    /**
     * Function to start the auto timer (either rotate or slide).
     */
    function startAutoTimer() {
        stopAutoTimer();
        // Don't start if hovering
        if (isHoveringGrid && !isMobileView) return; // Check isMobileView too

        if (currentVisibleCards.length > 1) {
             autoTimer = setInterval(() => {
                if (isMobileView) {
                    updateMobileSlider(currentMobileIndex + 1);
                } else {
                    rotateStack(1); // Auto-rotate forward
                }
            }, autoDelay);
        }
    }


    /**
     * Filters cards, updates the DOM, applies initial stack/slider state,
     * and restarts the auto timer.
     */
    function applyFilter(filterValue) {
        stopAutoTimer();

        // 1. Filter the master list
        if (filterValue === 'all') {
            currentVisibleCards = [...allCardsArray];
        } else {
            currentVisibleCards = allCardsArray.filter(cardLink => {
                const card = cardLink.querySelector('.portfolio-card');
                if (filterValue === 'all' && card.dataset.category === 'ALL') return true;
                return card.dataset.category === filterValue;
            });
        }

        // 2. Clear the grid in the DOM
        portfolioGrid.innerHTML = '';

        // 3. Add ONLY the filtered cards back to the DOM
        currentVisibleCards.forEach(card => {
            stackPositionClasses.forEach(cls => card.classList.remove(cls));
            card.classList.remove('active');
            card.style.opacity = '';
            card.style.transform = '';
            portfolioGrid.appendChild(card);
        });

        // 4. Apply initial state based on view
        if (isMobileView) {
            currentMobileIndex = 0;
            updateMobileSlider(currentMobileIndex);
        } else {
            applyStackClasses();
        }

        // 5. Restart auto timer
        startAutoTimer();
    }

    // --- Check Viewport Size ---
    function checkViewport() {
        const wasMobile = isMobileView;
        isMobileView = window.innerWidth <= 768;
        if (wasMobile !== isMobileView) {
            const currentFilterLink = filtersContainer.querySelector('.filter-link.active');
            const currentFilter = currentFilterLink ? currentFilterLink.dataset.filter : 'all';
            applyFilter(currentFilter); // Re-apply filter to reset layout and timer mode
        }
    }

    // --- Scroll Event Handler ---
    function handleWheelScroll(event) {
        if (isMobileView || !isHoveringGrid) return; // Only on desktop and when hovering

        event.preventDefault(); // Stop page scroll

        if (isScrolling) return; // Throttle active

        isScrolling = true;

        if (event.deltaY > 0) {
            // Scrolling down -> Rotate forward
            rotateStack(1);
        } else {
            // Scrolling up -> Rotate backward
            rotateStack(-1);
        }

        // Reset throttle flag after delay
        setTimeout(() => {
            isScrolling = false;
        }, scrollThrottleDelay);
    }


    // --- Initialize Everything on Load ---

    if (allCardsArray.length > 0) {

        // 1. Set up filter button clicks
        filtersContainer.addEventListener('click', (e) => {
            if (e.target.matches('.filter-link')) {
                e.preventDefault();
                filtersContainer.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');
                const filterValue = e.target.getAttribute('data-filter');
                applyFilter(filterValue);
            }
        });

        // 2. Set up mobile slider arrow clicks
        prevButton.addEventListener('click', () => {
            if(isMobileView) {
                stopAutoTimer();
                updateMobileSlider(currentMobileIndex - 1);
                startAutoTimer();
            }
        });

        nextButton.addEventListener('click', () => {
             if(isMobileView) {
                stopAutoTimer();
                updateMobileSlider(currentMobileIndex + 1);
                startAutoTimer();
            }
        });

        // 3. Add Hover and Wheel Listeners for Desktop Scroll
        portfolioGrid.addEventListener('mouseenter', () => {
            if (!isMobileView) {
                isHoveringGrid = true;
                stopAutoTimer(); // Pause auto-rotation on hover
            }
        });

        portfolioGrid.addEventListener('mouseleave', () => {
             if (!isMobileView) {
                isHoveringGrid = false;
                startAutoTimer(); // Resume auto-rotation on leave
            }
        });

        // Add wheel listener (will check hover state inside handler)
        portfolioGrid.addEventListener('wheel', handleWheelScroll, { passive: false }); // Need passive: false for preventDefault


        // 4. Listen for window resize to switch between stack/slider
        window.addEventListener('resize', checkViewport);

        // 5. Initial check and filter application on page load
        checkViewport();
        applyFilter('all');
    }

});