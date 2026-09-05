/* =========================================================================
   GREEN WORLD — delt adfærd
   1) Bottom-sheet mobilmenu
   2) Formularvalidering + afsendelse (Web3Forms med mailto-fallback)
   3) Indkøbskurv — se shoppingcart.md
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
  // Ingen tidlig return her: kurvkoden nedenfor skal køre på sider uden formular.
  var forms = document.querySelectorAll('[data-gw-form]');

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
      // Uden dette får alle Web3Forms-mails samme standardemne, og butikken kan
      // ikke se forskel på en bestilling og en besked fra kontaktsiden.
      if (form.dataset.subject) data.append('subject', form.dataset.subject);

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

  /* -----------------------------------------------------------------------
     6) Kurv — lager
        Kurven lever kun i kundens egen browser. Al læsning og skrivning er
        pakket ind: Safari i privat tilstand kaster på localStorage, og så
        skal varelisten stadig virke — bare uden at kurven overlever et
        sideskift.
     --------------------------------------------------------------------- */
  var CART_KEY  = 'gw-kurv-v1';
  var MAX_LINES = 40;
  var MAX_QTY   = 99;
  var MAX_AGE   = 30 * 24 * 60 * 60 * 1000;   // 30 dage

  var kr = function (n) {
    return n.toLocaleString('da-DK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' kr';
  };

  var readCart = function () {
    try {
      var data = JSON.parse(localStorage.getItem(CART_KEY) || 'null');
      if (!data || data.v !== 1 || !Array.isArray(data.lines)) return [];
      if (!data.updated || Date.now() - data.updated > MAX_AGE) return [];
      return data.lines.filter(function (l) {
        return l && l.sku && l.unit && typeof l.price === 'number' && l.qty > 0;
      }).slice(0, MAX_LINES);
    } catch (e) {
      return [];
    }
  };

  // Kurven holdes i hukommelsen og skrives igennem. Fejler skrivningen, virker
  // siden videre — kurven er bare væk ved næste sidevisning.
  var cart = readCart();

  var saveCart = function () {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify({ v: 1, updated: Date.now(), lines: cart }));
    } catch (e) { /* fuldt eller utilgængeligt lager */ }
    document.dispatchEvent(new CustomEvent('gw:cart'));
  };

  var findLine = function (sku, unit) {
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].sku === sku && cart[i].unit === unit) return cart[i];
    }
    return null;
  };

  var addLine = function (item) {
    var line = findLine(item.sku, item.unit);
    if (line) line.qty = Math.min(MAX_QTY, line.qty + 1);
    else if (cart.length < MAX_LINES) {
      cart.push({ sku: item.sku, name: item.name, unit: item.unit, price: item.price, qty: 1 });
    } else return false;
    saveCart();
    return true;
  };

  var setQty = function (sku, unit, qty) {
    var line = findLine(sku, unit);
    if (!line) return;
    qty = Math.max(0, Math.min(MAX_QTY, qty));
    if (qty === 0) cart = cart.filter(function (l) { return l !== line; });
    else line.qty = qty;
    saveCart();
  };

  var cartCount = function () {
    return cart.reduce(function (n, l) { return n + l.qty; }, 0);
  };
  var cartTotal = function () {
    return cart.reduce(function (n, l) { return n + l.price * l.qty; }, 0);
  };

  // Fælles annonceringsfelt — ét pr. side, så skærmlæseren ikke får 18 stemmer
  var live = document.createElement('p');
  live.className = 'gw-sr';
  live.setAttribute('aria-live', 'polite');
  document.body.appendChild(live);

  /* -----------------------------------------------------------------------
     7) Kurv — antalschip i menu og bundbjælke
     --------------------------------------------------------------------- */
  var paintCount = function () {
    var n = cartCount();
    document.querySelectorAll('[data-gw-cart-count]').forEach(function (el) {
      el.textContent = String(n);
      el.hidden = n === 0;
    });
  };
  document.addEventListener('gw:cart', paintCount);
  paintCount();

  /* -----------------------------------------------------------------------
     8) Kurv — trinvælger, genbrugt af både varekort og kurvside
     --------------------------------------------------------------------- */
  var makeStepper = function (label, onChange) {
    var box = document.createElement('div');
    box.className = 'gw-qty';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', 'Antal — ' + label);

    var mk = function (txt, aria, step) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'gw-qty__btn';
      b.textContent = txt;
      b.setAttribute('aria-label', aria + ' — ' + label);
      b.addEventListener('click', function () { onChange(step); });
      return b;
    };

    var dec = mk('−', 'Færre', -1);
    var val = document.createElement('span');
    val.className = 'gw-qty__val';
    var inc = mk('+', 'Flere', 1);

    box.append(dec, val, inc);
    box.dec = dec; box.val = val; box.inc = inc;
    return box;
  };

  /* -----------------------------------------------------------------------
     9) Kurv — kontrolrække på varelistens kort
        Kortenes markup røres ikke; alt udledes af data-units, så prislinjen
        og størrelsesvælgeren ikke kan komme ud af trit. Samme princip som
        varetællingen i afsnit 3.
     --------------------------------------------------------------------- */
  var parseUnits = function (raw) {
    return (raw || '').split('|').map(function (part) {
      var i = part.lastIndexOf(':');
      if (i < 0) return null;
      var label = part.slice(0, i).trim();
      var price = parseFloat(part.slice(i + 1));
      return (label && isFinite(price)) ? { label: label, price: price } : null;
    }).filter(Boolean);
  };

  document.querySelectorAll('.gw-prod[data-sku]').forEach(function (card) {
    var units = parseUnits(card.dataset.units);
    var body  = card.querySelector('.gw-prod__body');
    if (!units.length || !body) return;

    var sku  = card.dataset.sku;
    var name = card.dataset.name ||
               (card.querySelector('.gw-prod__name') || {}).textContent || sku;

    var byLabel = function (l) {
      return units.filter(function (u) { return u.label === l; })[0] || units[0];
    };

    var priceEl = document.createElement('p');
    priceEl.className = 'gw-prod__price';
    body.appendChild(priceEl);

    var wrap = document.createElement('div');
    wrap.className = 'gw-add';

    var select = document.createElement('select');
    select.className = 'gw-select gw-select--sm';
    select.setAttribute('aria-label', 'Størrelse — ' + name);
    units.forEach(function (u) {
      var opt = document.createElement('option');
      opt.value = u.label;
      opt.textContent = u.label;
      select.appendChild(opt);
    });

    var addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'gw-btn gw-btn--block';
    addBtn.textContent = 'Læg i kurv';
    addBtn.addEventListener('click', function () {
      var unit = select.value;
      if (addLine({ sku: sku, name: name, unit: unit, price: byLabel(unit).price })) {
        live.textContent = name + ', ' + unit + ' lagt i kurven.';
        stepper.inc.focus();          // fokus følger med over i trinvælgeren
      } else {
        live.textContent = 'Kurven er fuld. Send bestillingen, eller skriv resten under "Andre varer".';
      }
    });

    var stepper = makeStepper(name, function (step) {
      var unit = select.value;
      var line = findLine(sku, unit);
      var next = (line ? line.qty : 0) + step;
      setQty(sku, unit, next);
      live.textContent = next > 0
        ? name + ', ' + unit + ': ' + next + ' stk. i kurven.'
        : name + ', ' + unit + ' fjernet fra kurven.';
      if (next <= 0) addBtn.focus();
    });

    var slot = document.createElement('div');
    wrap.append(select, slot);
    body.appendChild(wrap);

    var render = function () {
      var unit = select.value;
      priceEl.textContent = kr(byLabel(unit).price);

      var line = findLine(sku, unit);
      var qty  = line ? line.qty : 0;

      // Skift kun indhold ved tilstandsskift — ellers mister "+" fokus,
      // hver gang tallet tælles op.
      if (qty === 0) {
        if (slot.dataset.mode !== 'add') { slot.dataset.mode = 'add'; slot.replaceChildren(addBtn); }
      } else {
        if (slot.dataset.mode !== 'qty') { slot.dataset.mode = 'qty'; slot.replaceChildren(stepper); }
        stepper.val.textContent = String(qty);
        stepper.inc.disabled = qty >= MAX_QTY;
      }
    };

    select.addEventListener('change', render);
    document.addEventListener('gw:cart', render);
    render();
  });

  /* -----------------------------------------------------------------------
     10) Kurv — kurvsiden
     --------------------------------------------------------------------- */
  var cartRoot = document.querySelector('[data-gw-cart]');
  if (cartRoot) {
    var listEl  = cartRoot.querySelector('[data-gw-cart-list]');
    var emptyEl = cartRoot.querySelector('[data-gw-cart-empty]');
    var sumEl   = cartRoot.querySelector('[data-gw-cart-sum]');
    var totalEl = cartRoot.querySelector('[data-gw-cart-total]');

    var buildRow = function (line) {
      var li = document.createElement('li');
      li.className = 'gw-cartrow';

      var main = document.createElement('div');
      main.className = 'gw-cartrow__main';
      var nm = document.createElement('p');
      nm.className = 'gw-cartrow__name';
      nm.textContent = line.name;
      var un = document.createElement('p');
      un.className = 'gw-cartrow__unit';
      un.textContent = line.unit + ' · ' + kr(line.price) + ' pr. stk.';
      main.append(nm, un);

      var label = line.name + ', ' + line.unit;
      var rowStepper = makeStepper(label, function (step) {
        var next = line.qty + step;
        setQty(line.sku, line.unit, next);
        live.textContent = next > 0
          ? label + ': ' + next + ' stk.'
          : label + ' fjernet fra kurven.';
      });
      rowStepper.val.textContent = String(line.qty);
      rowStepper.inc.disabled = line.qty >= MAX_QTY;

      var end = document.createElement('div');
      end.className = 'gw-cartrow__end';
      var sum = document.createElement('p');
      sum.className = 'gw-cartrow__sum';
      sum.textContent = kr(line.price * line.qty);

      var del = document.createElement('button');
      del.type = 'button';
      del.className = 'gw-remove';
      del.setAttribute('aria-label', 'Fjern ' + label + ' fra kurven');
      del.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
      del.addEventListener('click', function () {
        setQty(line.sku, line.unit, 0);
        live.textContent = label + ' fjernet fra kurven.';
      });

      end.append(sum, del);
      li.append(main, rowStepper, end);
      return li;
    };

    var renderCart = function () {
      if (listEl) listEl.replaceChildren.apply(listEl, cart.map(buildRow));
      var has = cart.length > 0;
      if (emptyEl) emptyEl.hidden = has;
      if (listEl)  listEl.hidden  = !has;
      if (sumEl)   sumEl.hidden   = !has;
      if (totalEl) totalEl.textContent = kr(cartTotal());
    };

    document.addEventListener('gw:cart', renderCart);
    renderCart();

    /* Formularen: kurven skrives ind i det skjulte Varer-felt lige før
       afsendelse. Lytteren sidder på document i capture-fasen — ved AT_TARGET
       kaldes lyttere i registreringsrækkefølge uanset capture-flag, så en
       lytter direkte på formularen ville køre EFTER afsenderen i afsnit 5. */
    document.addEventListener('submit', function (e) {
      var form = e.target;
      if (!form || !form.matches || !form.matches('[data-gw-cart-form]')) return;

      var hidden = form.querySelector('input[name="Varer"]');
      var extra  = form.querySelector('[name="Andre varer"]');
      var errEl  = form.querySelector('[data-gw-cart-error]');
      var extraTxt = extra ? extra.value.trim() : '';

      if (!cart.length && !extraTxt) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (errEl) {
          errEl.textContent = 'Din kurv er tom. Læg varer i kurven, eller skriv hvad du mangler under "Andre varer".';
          errEl.dataset.show = 'true';
          errEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
        if (extra) extra.focus();
        return;
      }

      if (errEl) errEl.dataset.show = 'false';

      if (hidden) {
        var lines = cart.map(function (l) {
          return '- ' + l.name + ' · ' + l.unit + ' × ' + l.qty + ' = ' + kr(l.price * l.qty);
        });
        if (lines.length) {
          lines.push('Anslået i alt: ' + kr(cartTotal()) +
                     '  (priser er vejledende — bekræftes ved kontakt)');
        }
        hidden.value = lines.join('\n');
      }
    }, true);

    /* Tøm først kurven, når endpointet har bekræftet modtagelsen. Ved
       mailto-fallback er intet sendt endnu, så der bliver kurven stående. */
    var okPanel = document.getElementById('ok-kurv');
    if (okPanel && window.MutationObserver) {
      new MutationObserver(function () {
        if (okPanel.dataset.show === 'true' && cart.length) {
          cart = [];
          saveCart();
        }
      }).observe(okPanel, { attributes: true, attributeFilter: ['data-show'] });
    }
  }
})();
