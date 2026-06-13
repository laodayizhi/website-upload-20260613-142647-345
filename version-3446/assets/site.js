(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (toggle && panel) {
        toggle.addEventListener('click', function () {
            panel.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === index);
            });
        }

        function start() {
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                window.clearInterval(timer);
                show(i);
                start();
            });
        });

        start();
    }

    var panelFilter = document.querySelector('[data-filter-panel]');
    if (panelFilter) {
        var keywordInput = panelFilter.querySelector('[data-filter-keyword]');
        var categorySelect = panelFilter.querySelector('[data-filter-category]');
        var typeSelect = panelFilter.querySelector('[data-filter-type]');
        var regionInput = panelFilter.querySelector('[data-filter-region]');
        var yearInput = panelFilter.querySelector('[data-filter-year]');
        var resetButton = panelFilter.querySelector('[data-filter-reset]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
        var emptyState = document.querySelector('[data-empty-state]');
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q') || '';

        if (keywordInput && initialQuery) {
            keywordInput.value = initialQuery;
        }

        function includes(value, query) {
            return !query || String(value || '').toLowerCase().indexOf(query.toLowerCase()) !== -1;
        }

        function filterCards() {
            var keyword = keywordInput ? keywordInput.value.trim() : '';
            var category = categorySelect ? categorySelect.value : '';
            var type = typeSelect ? typeSelect.value : '';
            var region = regionInput ? regionInput.value.trim() : '';
            var year = yearInput ? yearInput.value.trim() : '';
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = [
                    card.dataset.title,
                    card.dataset.region,
                    card.dataset.type,
                    card.dataset.category,
                    card.dataset.year,
                    card.dataset.tags
                ].join(' ');
                var matched = includes(haystack, keyword)
                    && includes(card.dataset.category, category)
                    && includes(card.dataset.type, type)
                    && includes(card.dataset.region, region)
                    && includes(card.dataset.year, year);
                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle('visible', visible === 0);
            }
        }

        [keywordInput, categorySelect, typeSelect, regionInput, yearInput].forEach(function (control) {
            if (!control) {
                return;
            }
            control.addEventListener('input', filterCards);
            control.addEventListener('change', filterCards);
        });

        if (resetButton) {
            resetButton.addEventListener('click', function () {
                [keywordInput, regionInput, yearInput].forEach(function (control) {
                    if (control) {
                        control.value = '';
                    }
                });
                [categorySelect, typeSelect].forEach(function (control) {
                    if (control) {
                        control.value = '';
                    }
                });
                filterCards();
            });
        }

        filterCards();
    }
})();
