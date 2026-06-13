(function () {
    var menuButton = document.querySelector(".menu-toggle");
    var siteNav = document.querySelector(".site-nav");
    var headerSearch = document.querySelector(".header-search");

    if (menuButton && siteNav) {
        menuButton.addEventListener("click", function () {
            siteNav.classList.toggle("open");
            if (headerSearch) {
                headerSearch.classList.toggle("open");
            }
        });
    }

    var backTop = document.querySelector(".back-top");
    if (backTop) {
        backTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    var slider = document.querySelector("[data-hero-slider]");
    if (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === current);
            });
        }

        function schedule() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-slide")) || 0);
                schedule();
            });
        });

        if (slides.length > 1) {
            schedule();
        }
    }

    var filterGrid = document.querySelector(".filter-grid");
    var searchInput = document.querySelector(".catalog-search");
    var typeFilter = document.querySelector(".type-filter");
    var regionFilter = document.querySelector(".region-filter");
    var yearFilter = document.querySelector(".year-filter");

    if (filterGrid && searchInput) {
        var cards = Array.prototype.slice.call(filterGrid.querySelectorAll(".movie-card"));
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get("q") || "";
        if (initialQuery) {
            searchInput.value = initialQuery;
        }

        function normalize(value) {
            return (value || "").toString().trim().toLowerCase();
        }

        function applyFilters() {
            var query = normalize(searchInput.value);
            var type = normalize(typeFilter ? typeFilter.value : "");
            var region = normalize(regionFilter ? regionFilter.value : "");
            var year = normalize(yearFilter ? yearFilter.value : "");

            cards.forEach(function (card) {
                var text = normalize([
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-type"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-tags")
                ].join(" "));
                var matched = true;
                if (query && text.indexOf(query) === -1) {
                    matched = false;
                }
                if (type && normalize(card.getAttribute("data-type")) !== type) {
                    matched = false;
                }
                if (region && normalize(card.getAttribute("data-region")) !== region) {
                    matched = false;
                }
                if (year && normalize(card.getAttribute("data-year")) !== year) {
                    matched = false;
                }
                card.classList.toggle("is-hidden", !matched);
            });
        }

        [searchInput, typeFilter, regionFilter, yearFilter].forEach(function (control) {
            if (control) {
                control.addEventListener("input", applyFilters);
                control.addEventListener("change", applyFilters);
            }
        });

        applyFilters();
    }
}());
