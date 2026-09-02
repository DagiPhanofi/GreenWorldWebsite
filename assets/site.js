/* =========================================================================
   GREEN WORLD — delt adfærd
   1) Bottom-sheet mobilmenu
   2) Formularvalidering + afsendelse (Web3Forms med mailto-fallback)
   ========================================================================= */
(function () {
  'use strict';

  /* -----------------------------------------------------------------------
     1) Mobilmenu
     --------------------------------------------------------------------- */
  var burger = document.querySelector('[data-menu-toggle]');
  var sheet  = document.getElementById('gw-sheet');
  var scrim  = document.getElementById('gw-scrim');

  if (burger && sheet && scrim) {
    var lastFocus = null;
    var burgerLabel = burger.querySelector('.gw-sr');

    var setMenu = function (open) {
      sheet.dataset.open = String(open);
      scrim.dataset.open = String(open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.dataset.locked = String(open);
      sheet.setAttribute('aria-hidden', String(!open));
      // Navnet skal følge tilstanden — ellers siger skærmlæseren "Åbn menu",
      // mens menuen står åben.
      if (burgerLabel) burgerLabel.textContent = open ? 'Luk menu' : 'Åbn menu';

      if (open) {
        lastFocus = document.activeElement;
        var first = sheet.querySelector('a, button');
        if (first) first.focus();
      } else if (lastFocus) {
        lastFocus.focus();
      }
    };

    burger.addEventListener('click', function () {
      setMenu(sheet.dataset.open !== 'true');
    });
    scrim.addEventListener('click', function () { setMenu(false); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sheet.dataset.open === 'true') setMenu(false);
    });

    // Hold fokus inde i arket, mens det er åbent
    sheet.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || sheet.dataset.open !== 'true') return;
      var items = sheet.querySelectorAll('a[href], button:not([disabled])');
      if (!items.length) return;
      var first = items[0];
      var last  = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    // Luk hvis vinduet vokser til desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 900 && sheet.dataset.open === 'true') setMenu(false);
    });
  }

  /* -----------------------------------------------------------------------
     2) Årstal i footeren
     --------------------------------------------------------------------- */
  var yearEl = document.querySelector('[data-gw-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* -----------------------------------------------------------------------
     3) Antal varer pr. kategori — udregnes, så tallet ikke kan drifte
     --------------------------------------------------------------------- */
  document.querySelectorAll('.gw-cat__count').forEach(function (el) {
    var section = el.closest('section');
    if (!section) return;
    var n = section.querySelectorAll('.gw-prod').length;
    el.textContent = n + (n === 1 ? ' vare' : ' varer');
  });

  /* -----------------------------------------------------------------------
     4) Kort indlæses først på klik — ingen Google-indhold uden samtykke
     --------------------------------------------------------------------- */
  document.querySelectorAll('[data-gw-map]').forEach(function (box) {
    var btn = box.querySelector('[data-gw-map-load]');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var frame = document.createElement('iframe');
      frame.title = box.dataset.gwMapTitle || 'Kort';
      frame.src = box.dataset.gwMap;
      frame.loading = 'lazy';
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      frame.style.cssText = 'width:100%;height:100%;border:0;display:block';
      box.replaceChildren(frame);
    });
  });

  /* -----------------------------------------------------------------------
     5) Formularer
     --------------------------------------------------------------------- */
  var forms = document.querySelectorAll('[data-gw-form]');
  if (!forms.length) return;

  var showError = function (field, msg) {
    var input = field.querySelector('.gw-input, .gw-textarea, .gw-select');
    var err   = field.querySelector('.gw-error');
    if (input) input.setAttribute('aria-invalid', 'true');
    if (err) { err.textContent = msg; err.dataset.show = 'true'; }
  };

  var clearError = function (field) {
    var input = field.querySelector('.gw-input, .gw-textarea, .gw-select');
    var err   = field.querySelector('.gw-error');
    if (input) input.removeAttribute('aria-invalid');
    if (err) err.dataset.show = 'false';
  };

  var validate = function (form) {
    var ok = true;
    var firstBad = null;

    form.querySelectorAll('.gw-field').forEach(function (field) {
      var input = field.querySelector('[required]');
      clearError(field);
      if (!input) return;

      var val = (input.value || '').trim();

      if (!val) {
        showError(field, input.dataset.msg || 'Feltet skal udfyldes.');
        ok = false;
        if (!firstBad) firstBad = input;
        return;
      }
      if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) {
        showError(field, 'Skriv en gyldig e-mailadresse.');
        ok = false;
        if (!firstBad) firstBad = input;
        return;
      }
      if (input.type === 'tel' && val.replace(/\D/g, '').length < 8) {
        showError(field, 'Skriv et gyldigt telefonnummer (mindst 8 cifre).');
        ok = false;
        if (!firstBad) firstBad = input;
      }
    });

    if (firstBad) firstBad.focus();
    return ok;
  };

  // Ryd fejlen så snart brugeren retter feltet
  document.querySelectorAll('.gw-field [required]').forEach(function (input) {
    input.addEventListener('input', function () {
      var field = input.closest('.gw-field');
      if (field && input.getAttribute('aria-invalid') === 'true' && input.value.trim()) clearError(field);
    });
  });

  var toMailto = function (form) {
    var to = form.dataset.mailto || 'gwservice@gmail.com';
    var lines = [];
    new FormData(form).forEach(function (v, k) {
      if (k.charAt(0) === '_' || k === 'access_key' || !String(v).trim()) return;
      lines.push(k + ': ' + v);
    });
    return 'mailto:' + to +
      '?subject=' + encodeURIComponent(form.dataset.subject || 'Henvendelse fra hjemmesiden') +
      '&body=' + encodeURIComponent(lines.join('\n'));
  };

  forms.forEach(function (form) {
    form.setAttribute('novalidate', 'novalidate');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate(form)) return;

      var btn     = form.querySelector('[type="submit"]');
      var key     = (form.dataset.accessKey || '').trim();
      var ok      = document.getElementById(form.dataset.success);
      var pending = document.getElementById(form.dataset.pending);

      var reveal = function (panel) {
        if (!panel) return;
        form.style.display = 'none';
        panel.dataset.show = 'true';
        panel.setAttribute('tabindex', '-1');
        panel.focus();
        panel.scrollIntoView({ block: 'center', behavior: 'smooth' });
      };

      // Bekræftet modtaget af endpointet.
      var succeed = function () { reveal(ok); };

      // Vi har KUN åbnet brugerens mailprogram. Vi kan ikke vide, om beskeden
      // blev sendt — så vis aldrig kvitteringen her.
      var handoff = function () {
        window.location.href = toMailto(form);
        reveal(pending || ok);
      };

      // Intet endpoint konfigureret endnu → fald tilbage til en forudfyldt e-mail
      if (!key || key.indexOf('INDSÆT') === 0) {
        handoff();
        return;
      }

      var label = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sender …'; }

      var restore = function () {
        if (btn) { btn.disabled = false; btn.textContent = label; }
      };

      var data = new FormData(form);
      data.append('access_key', key);

      fetch('https://api.web3forms.com/submit', { method: 'POST', body: data })
        .then(function (r) {
          // Uden dette tjek ryger en 5xx-HTML-fejlside videre til r.json()
          // og lander i catch som var det en netværksfejl.
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        })
        .then(function (r) {
          restore();
          if (r && r.success) succeed();
          else handoff();
        })
        .catch(function () {
          // Netværks- eller serverfejl → brugeren mister ikke sin bestilling
          restore();
          handoff();
        });
    });
  });
})();
