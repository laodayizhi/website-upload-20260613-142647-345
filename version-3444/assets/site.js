(function () {
    var mobileButton = document.querySelector('.mobile-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (mobileButton && mobileNav) {
        mobileButton.addEventListener('click', function () {
            var open = mobileNav.classList.toggle('open');
            mobileButton.setAttribute('aria-expanded', String(open));
        });
    }

    document.addEventListener('error', function (event) {
        var target = event.target;
        if (target && target.tagName === 'IMG') {
            target.classList.add('cover-off');
        }
    }, true);

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === index);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')));
                restart();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                restart();
            });
        }

        show(0);
        restart();
    }

    var searchPanel = document.querySelector('[data-search-panel]');
    if (searchPanel) {
        var queryInput = searchPanel.querySelector('[data-search-query]');
        var typeSelect = searchPanel.querySelector('[data-filter-type]');
        var regionSelect = searchPanel.querySelector('[data-filter-region]');
        var yearSelect = searchPanel.querySelector('[data-filter-year]');
        var categorySelect = searchPanel.querySelector('[data-filter-category]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search-card]'));
        var empty = document.querySelector('[data-empty-state]');

        function norm(value) {
            return String(value || '').toLowerCase().trim();
        }

        function matchSelect(card, attr, value) {
            return !value || card.getAttribute(attr) === value;
        }

        searchPanel.addEventListener('submit', function (event) {
            event.preventDefault();
        });

        function filterCards() {
            var query = norm(queryInput ? queryInput.value : '');
            var type = typeSelect ? typeSelect.value : '';
            var region = regionSelect ? regionSelect.value : '';
            var year = yearSelect ? yearSelect.value : '';
            var category = categorySelect ? categorySelect.value : '';
            var visible = 0;

            cards.forEach(function (card) {
                var content = norm([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-category'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-tags')
                ].join(' '));
                var ok = true;
                ok = ok && (!query || content.indexOf(query) !== -1);
                ok = ok && matchSelect(card, 'data-type', type);
                ok = ok && matchSelect(card, 'data-region', region);
                ok = ok && matchSelect(card, 'data-year', year);
                ok = ok && matchSelect(card, 'data-category', category);
                card.style.display = ok ? '' : 'none';
                if (ok) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('show', visible === 0);
            }
        }

        [queryInput, typeSelect, regionSelect, yearSelect, categorySelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', filterCards);
                control.addEventListener('change', filterCards);
            }
        });

        filterCards();
    }

    var player = document.querySelector('[data-player]');
    if (player) {
        var video = player.querySelector('video');
        var overlay = player.querySelector('.player-overlay');
        var sourceUrl = player.getAttribute('data-video');
        var attached = false;

        function attachSource() {
            if (!video || !sourceUrl || attached) {
                return;
            }
            attached = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = sourceUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(sourceUrl);
                hls.attachMedia(video);
            } else {
                video.src = sourceUrl;
            }
        }

        function startPlayback() {
            attachSource();
            if (overlay) {
                overlay.classList.add('hidden');
            }
            if (video) {
                video.controls = true;
                var promise = video.play();
                if (promise && typeof promise.catch === 'function') {
                    promise.catch(function () {
                        video.muted = true;
                        video.play();
                    });
                }
            }
        }

        if (overlay) {
            overlay.addEventListener('click', startPlayback);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    startPlayback();
                }
            });
        }
    }
})();
