(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var menuButton = document.querySelector('[data-mobile-menu]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuButton && mobilePanel) {
      menuButton.addEventListener('click', function () {
        mobilePanel.classList.toggle('open');
      });
    }

    var backTop = document.querySelector('[data-back-top]');

    if (backTop) {
      window.addEventListener('scroll', function () {
        backTop.classList.toggle('visible', window.scrollY > 500);
      });

      backTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    initHeroCarousel();
    initLocalFilters();
  });

  function initHeroCarousel() {
    var carousel = document.querySelector('[data-hero-carousel]');

    if (!carousel) {
      return;
    }

    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var prev = carousel.querySelector('[data-hero-prev]');
    var next = carousel.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function initLocalFilters() {
    var cardList = document.querySelector('[data-card-list]');

    if (!cardList) {
      return;
    }

    var cards = Array.prototype.slice.call(cardList.querySelectorAll('.movie-card'));
    var searchInput = document.querySelector('[data-local-search]');
    var yearSelect = document.querySelector('[data-filter-year]');
    var typeSelect = document.querySelector('[data-filter-type]');
    var clearButton = document.querySelector('[data-clear-filter]');
    var counter = document.querySelector('[data-result-counter]');

    function apply() {
      var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
      var year = yearSelect ? yearSelect.value : '';
      var type = typeSelect ? typeSelect.value : '';
      var visibleCount = 0;

      cards.forEach(function (card) {
        var haystack = card.getAttribute('data-search') || '';
        var cardYear = card.getAttribute('data-year') || '';
        var cardType = card.getAttribute('data-type') || '';
        var matched = true;

        if (query && haystack.indexOf(query) === -1) {
          matched = false;
        }

        if (year && cardYear !== year) {
          matched = false;
        }

        if (type && cardType !== type) {
          matched = false;
        }

        card.classList.toggle('is-hidden', !matched);

        if (matched) {
          visibleCount += 1;
        }
      });

      if (counter) {
        counter.textContent = visibleCount + ' 部';
      }
    }

    [searchInput, yearSelect, typeSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });

    if (clearButton) {
      clearButton.addEventListener('click', function () {
        if (searchInput) {
          searchInput.value = '';
        }

        if (yearSelect) {
          yearSelect.value = '';
        }

        if (typeSelect) {
          typeSelect.value = '';
        }

        apply();
      });
    }

    apply();
  }
})();
