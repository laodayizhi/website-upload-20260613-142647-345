(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var toggles = document.querySelectorAll("[data-menu-toggle]");
        toggles.forEach(function (button) {
            button.addEventListener("click", function () {
                var target = document.getElementById(button.getAttribute("data-menu-toggle"));
                if (target) {
                    target.classList.toggle("open");
                }
            });
        });

        var carousel = document.querySelector("[data-hero-carousel]");
        if (carousel) {
            var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
            var dotsWrap = carousel.querySelector("[data-hero-dots]");
            var index = 0;
            var timer = null;

            function show(next) {
                index = (next + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("active", slideIndex === index);
                });
                if (dotsWrap) {
                    Array.prototype.slice.call(dotsWrap.children).forEach(function (dot, dotIndex) {
                        dot.classList.toggle("active", dotIndex === index);
                    });
                }
            }

            function start() {
                if (timer) {
                    clearInterval(timer);
                }
                timer = setInterval(function () {
                    show(index + 1);
                }, 5200);
            }

            if (dotsWrap) {
                slides.forEach(function (_, dotIndex) {
                    var dot = document.createElement("button");
                    dot.type = "button";
                    dot.className = "hero-dot";
                    dot.setAttribute("aria-label", "切换焦点影片");
                    dot.addEventListener("click", function () {
                        show(dotIndex);
                        start();
                    });
                    dotsWrap.appendChild(dot);
                });
            }

            show(0);
            start();
        }

        var filterInput = document.querySelector("[data-filter-input]");
        var filterGenre = document.querySelector("[data-filter-genre]");
        var filterYear = document.querySelector("[data-filter-year]");
        var filterType = document.querySelector("[data-filter-type]");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));

        function valueOf(element) {
            return element ? element.value.trim().toLowerCase() : "";
        }

        function applyFilter() {
            var query = valueOf(filterInput);
            var genre = valueOf(filterGenre);
            var year = valueOf(filterYear);
            var type = valueOf(filterType);

            cards.forEach(function (card) {
                var title = (card.getAttribute("data-title") || "").toLowerCase();
                var meta = (card.getAttribute("data-meta") || "").toLowerCase();
                var cardYear = (card.getAttribute("data-year") || "").toLowerCase();
                var cardType = (card.getAttribute("data-type") || "").toLowerCase();
                var cardRegion = (card.getAttribute("data-region") || "").toLowerCase();
                var text = title + " " + meta + " " + cardYear + " " + cardType + " " + cardRegion;
                var matched = true;

                if (query && text.indexOf(query) === -1) {
                    matched = false;
                }
                if (genre && meta.indexOf(genre) === -1) {
                    matched = false;
                }
                if (year && cardYear !== year) {
                    matched = false;
                }
                if (type && cardType.indexOf(type) === -1) {
                    matched = false;
                }

                card.classList.toggle("hidden", !matched);
            });
        }

        [filterInput, filterGenre, filterYear, filterType].forEach(function (element) {
            if (element) {
                element.addEventListener("input", applyFilter);
                element.addEventListener("change", applyFilter);
            }
        });
    });
})();
