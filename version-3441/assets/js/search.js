(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function cardTemplate(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return [
      '<article class="movie-card">',
      '  <a class="poster-link" href="' + escapeHtml(movie.url) + '">',
      '    <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="play-chip">播放</span>',
      '  </a>',
      '  <div class="movie-card-body">',
      '    <div class="movie-card-meta">',
      '      <span>' + escapeHtml(movie.year) + '</span>',
      '      <span>' + escapeHtml(movie.type) + '</span>',
      '      <span>评分 ' + escapeHtml(movie.rating) + '</span>',
      '    </div>',
      '    <h3><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h3>',
      '    <p>' + escapeHtml(movie.oneLine) + '</p>',
      '    <div class="tag-line">' + tags + '</div>',
      '  </div>',
      '</article>'
    ].join('\n');
  }

  ready(function () {
    var movies = window.MOVIE_INDEX || [];
    var input = document.getElementById('global-search-input');
    var button = document.getElementById('global-search-button');
    var typeFilter = document.getElementById('global-type-filter');
    var yearFilter = document.getElementById('global-year-filter');
    var results = document.getElementById('global-search-results');
    var count = document.getElementById('global-result-count');

    if (!input || !results) {
      return;
    }

    var years = Array.from(new Set(movies.map(function (movie) {
      return movie.year;
    }).filter(Boolean))).sort().reverse();

    if (yearFilter) {
      years.forEach(function (year) {
        var option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
      });
    }

    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';
    input.value = initialQuery;

    function render() {
      var query = input.value.trim().toLowerCase();
      var type = typeFilter ? typeFilter.value : '';
      var year = yearFilter ? yearFilter.value : '';
      var matched = movies.filter(function (movie) {
        var haystack = [
          movie.title,
          movie.year,
          movie.type,
          movie.region,
          movie.genre,
          (movie.tags || []).join(' '),
          movie.category
        ].join(' ').toLowerCase();

        if (query && haystack.indexOf(query) === -1) {
          return false;
        }

        if (type && movie.type !== type) {
          return false;
        }

        if (year && movie.year !== year) {
          return false;
        }

        return true;
      });

      if (!query && !type && !year) {
        matched = movies.slice(0, 60);
      }

      results.innerHTML = matched.slice(0, 240).map(cardTemplate).join('\n');

      if (count) {
        count.textContent = matched.length + ' 部';
      }
    }

    input.addEventListener('input', render);

    if (button) {
      button.addEventListener('click', render);
    }

    if (typeFilter) {
      typeFilter.addEventListener('change', render);
    }

    if (yearFilter) {
      yearFilter.addEventListener('change', render);
    }

    render();
  });
})();
