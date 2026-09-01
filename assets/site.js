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

    var setMenu = function (open) {
      sheet.dataset.open = String(open);
      scrim.dataset.open = String(open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.dataset.locked = String(open);
      sheet.setAttribute('aria-hidden', String(!open));

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
     2) Formularer
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

      var btn = form.querySelector('[type="submit"]');
      var key = (form.dataset.accessKey || '').trim();
      var ok  = document.getElementById(form.dataset.success);

      var succeed = function () {
        if (ok) {
          form.style.display = 'none';
          ok.dataset.show = 'true';
          ok.setAttribute('tabindex', '-1');
          ok.focus();
          ok.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
      };

      // Intet endpoint konfigureret endnu → fald tilbage til en forudfyldt e-mail
      if (!key || key.indexOf('INDSÆT') === 0) {
        window.location.href = toMailto(form);
        succeed();
        return;
      }

      var label = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sender …'; }

      var data = new FormData(form);
      data.append('access_key', key);

      fetch('https://api.web3forms.com/submit', { method: 'POST', body: data })
        .then(function (r) { return r.json(); })
        .then(function (r) {
          if (r && r.success) { succeed(); }
          else { window.location.href = toMailto(form); succeed(); }
        })
        .catch(function () {
          // Netværksfejl → brugeren mister ikke sin bestilling
          window.location.href = toMailto(form);
          succeed();
        })
        .then(function () {
          if (btn) { btn.disabled = false; btn.textContent = label; }
        });
    });
  });
})();
