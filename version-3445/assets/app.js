(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    initMenu();
    initHero();
    initImages();
    initLibraryTools();
    initHeaderSearch();
  });

  function initMenu() {
    var toggle = document.querySelector(".menu-toggle");
    var panel = document.querySelector(".nav-panel");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      var open = panel.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "×" : "☰";
    });
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    if (slides.length < 2) {
      return;
    }
    var index = 0;
    var timer = null;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, current) {
        slide.classList.toggle("is-active", current === index);
      });
      dots.forEach(function (dot, current) {
        dot.classList.toggle("is-active", current === index);
      });
    }
    function play() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        window.clearInterval(timer);
        show(Number(dot.getAttribute("data-slide") || 0));
        play();
      });
    });
    play();
  }

  function initImages() {
    Array.prototype.forEach.call(document.querySelectorAll("img"), function (img) {
      img.addEventListener("error", function () {
        img.classList.add("image-fallback");
      });
    });
  }

  function initHeaderSearch() {
    Array.prototype.forEach.call(document.querySelectorAll(".global-search"), function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector("input[name='q']");
        if (!input || !input.value.trim()) {
          event.preventDefault();
          window.location.href = "./videos.html";
        }
      });
    });
  }

  function initLibraryTools() {
    var lists = Array.prototype.slice.call(document.querySelectorAll(".searchable-list"));
    if (!lists.length) {
      return;
    }
    var search = document.getElementById("movieSearch") || document.querySelector(".inline-filter");
    var groupFilter = document.getElementById("categoryFilter");
    var typeFilter = document.getElementById("typeFilter");
    var sortFilter = document.getElementById("sortFilter") || document.querySelector(".inline-sort");
    var state = document.querySelector(".result-state");
    var cards = [];
    lists.forEach(function (list) {
      cards = cards.concat(Array.prototype.slice.call(list.querySelectorAll(".movie-card")));
    });
    var query = new URLSearchParams(window.location.search).get("q") || "";
    if (search && query) {
      search.value = query;
    }
    function text(card) {
      return [
        card.getAttribute("data-title"),
        card.getAttribute("data-tags"),
        card.getAttribute("data-region"),
        card.getAttribute("data-type")
      ].join(" ").toLowerCase();
    }
    function apply() {
      var value = search ? search.value.trim().toLowerCase() : "";
      var group = groupFilter ? groupFilter.value : "all";
      var type = typeFilter ? typeFilter.value : "all";
      var shown = false;
      cards.forEach(function (card) {
        var matchText = !value || text(card).indexOf(value) !== -1;
        var matchGroup = group === "all" || card.getAttribute("data-group") === group;
        var matchType = type === "all" || (card.getAttribute("data-type") || "").indexOf(type) !== -1;
        var visible = matchText && matchGroup && matchType;
        card.classList.toggle("is-hidden", !visible);
        if (visible) {
          shown = true;
        }
      });
      if (sortFilter) {
        sortCards(sortFilter.value, lists);
      }
      if (state) {
        state.textContent = shown ? "已根据条件更新片库" : "暂无匹配影片";
      }
    }
    [search, groupFilter, typeFilter, sortFilter].forEach(function (control) {
      if (control) {
        control.addEventListener("input", apply);
        control.addEventListener("change", apply);
      }
    });
    apply();
  }

  function sortCards(mode, lists) {
    lists.forEach(function (list) {
      var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
      if (mode === "rating") {
        cards.sort(function (a, b) {
          return Number(b.getAttribute("data-rating")) - Number(a.getAttribute("data-rating"));
        });
      } else if (mode === "year") {
        cards.sort(function (a, b) {
          return String(b.getAttribute("data-year")).localeCompare(String(a.getAttribute("data-year")));
        });
      }
      cards.forEach(function (card) {
        list.appendChild(card);
      });
    });
  }
})();
