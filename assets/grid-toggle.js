/*
  "Products per row" toggle for collection pages.
  Stores the choice in localStorage and reflects it as a class on <html>
  (cc-grid-4 / cc-grid-6). No class = the theme's default column count.
  Click handling is delegated so it keeps working after the facets AJAX
  re-renders the sort bar / product grid.
*/
(function () {
  var KEY = 'cc-grid-cols';
  var VALID = ['3', '4', '6'];

  function apply(value) {
    var root = document.documentElement;
    root.classList.remove('cc-grid-4', 'cc-grid-6');
    if (value === '4' || value === '6') {
      root.classList.add('cc-grid-' + value);
    }
  }

  function read() {
    var v;
    try {
      v = localStorage.getItem(KEY);
    } catch (e) {
      v = null;
    }
    return VALID.indexOf(v) === -1 ? '3' : v;
  }

  apply(read());

  document.addEventListener('click', function (event) {
    var btn = event.target.closest && event.target.closest('.cc-grid-toggle__btn');
    if (!btn) return;
    var value = btn.getAttribute('data-cc-grid');
    if (VALID.indexOf(value) === -1) return;
    try {
      localStorage.setItem(KEY, value);
    } catch (e) {
      /* private mode – choice just won't persist */
    }
    apply(value);
  });
})();
