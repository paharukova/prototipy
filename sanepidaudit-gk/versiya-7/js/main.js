/* ГК «Санэпидаудит-Кузбасс» — общий скрипт: меню, формы, подсказки, АМР-Мед. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Меню на телефоне */
  var burger = $(".burger"), menu = $(".mobile-menu");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { menu.classList.remove("open"); }); });
  }

  /* Подсказка для страниц, которых пока нет (следующий этап) */
  var toast = document.createElement("div");
  toast.className = "toast"; toast.setAttribute("role", "status");
  document.body.appendChild(toast);
  var tt;
  function say(text) {
    toast.textContent = text; toast.classList.add("show");
    clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove("show"); }, 2600);
  }
  $$("[data-soon]").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); say(a.getAttribute("data-soon") || "Эта страница появится на следующем этапе"); });
  });

  /* Метки рекламы (utm) — уходят вместе с заявкой */
  var params = new URLSearchParams(location.search);
  var utm = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
    .filter(function (k) { return params.get(k); })
    .map(function (k) { return k + "=" + params.get(k); }).join("&");

  /* Маска телефона: +7 (___) ___-__-__ */
  function formatPhone(v) {
    var d = v.replace(/\D/g, "");
    if (d.charAt(0) === "8") d = "7" + d.slice(1);
    if (d && d.charAt(0) !== "7") d = "7" + d;
    d = d.slice(0, 11);
    var out = "+7";
    if (d.length > 1) out += " (" + d.slice(1, 4);
    if (d.length >= 4) out += ")";
    if (d.length > 4) out += " " + d.slice(4, 7);
    if (d.length > 7) out += "-" + d.slice(7, 9);
    if (d.length > 9) out += "-" + d.slice(9, 11);
    return out;
  }
  $$("input[type=tel]").forEach(function (i) {
    i.addEventListener("input", function () { i.value = i.value ? formatPhone(i.value) : ""; });
  });

  /* Формы: проверка полей, отправка, ответ */
  $$("form[data-lead]").forEach(function (f) {
    var hidden = document.createElement("input");
    hidden.type = "hidden"; hidden.name = "utm"; hidden.value = utm; f.appendChild(hidden);

    function check(field) {
      var input = $("input, select, textarea", field);
      if (!input) return true;
      var v = (input.value || "").trim(), ok = true;
      if (input.type === "tel") ok = v.replace(/\D/g, "").length === 11;
      else if (input.required) ok = v.length >= (input.tagName === "SELECT" ? 1 : 2);
      field.classList.toggle("is-error", !ok);
      input.setAttribute("aria-invalid", ok ? "false" : "true");
      return ok;
    }
    $$(".field", f).forEach(function (field) {
      var input = $("input, select, textarea", field);
      if (input) input.addEventListener("blur", function () { if (input.value) check(field); });
      if (input) input.addEventListener("input", function () { if (field.classList.contains("is-error")) check(field); });
    });

    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true, first = null;
      $$(".field", f).forEach(function (field) { if (!check(field)) { ok = false; first = first || field; } });
      if (!ok) { $("input, select, textarea", first).focus(); return; }
      var btn = $("button[type=submit]", f), label = btn && $(".btn__label", btn);
      if (btn) { btn.disabled = true; if (label) { label.dataset.t = label.textContent; label.textContent = "Отправляем…"; } }
      /* Демо: на рабочем сайте здесь заявка уйдёт в Telegram или на почту нужной компании группы */
      setTimeout(function () {
        f.classList.add("is-sent");
        if (btn) { btn.disabled = false; if (label) label.textContent = label.dataset.t; }
      }, 900);
    });
  });

  /* Кнопки «Выбрать направление» в форме: подставляют направление */
  $$("[data-pick-dir]").forEach(function (a) {
    a.addEventListener("click", function () {
      var sel = $("#order-dir");
      if (sel) sel.value = a.getAttribute("data-pick-dir");
    });
  });

  /* Лесенка направлений: ступень окрашивается в цвет направления, рядом — описание */
  var panel = $("#stairs-panel");
  if (panel) {
    var def = panel.innerHTML, defC = getComputedStyle(panel).getPropertyValue("--c");
    function show(st) {
      var c = getComputedStyle(st).getPropertyValue("--c");
      panel.style.setProperty("--c", c);
      panel.innerHTML = '<span class="dir-card__num">' + st.dataset.num + '</span><b>' + st.dataset.title +
        '</b><p class="caption">' + st.dataset.org + '</p><p>' + st.dataset.tasks + '</p>' +
        '<p style="margin-top:8px"><span class="link-more">Нажмите на ступень, чтобы открыть →</span></p>';
    }
    $$(".step").forEach(function (st) {
      st.addEventListener("mouseenter", function () { show(st); });
      st.addEventListener("focus", function () { show(st); });
    });
    $(".stairs__steps").addEventListener("mouseleave", function () { panel.innerHTML = def; panel.style.setProperty("--c", defC); });
  }

  /* Благодарственные письма: лента документов, по нажатию — крупный просмотр */
  var strip = $("[data-letters]");
  if (strip) {
    var base = strip.getAttribute("data-letters") || "";
    var LETTERS = [
      { src: "img/foto/14-blagodarnost-1.jpg", from: "ООО «Центр оценки и экспертиз»", what: "Коллективу «АМР-Мед» — с Днём медицинского работника" },
      { src: "img/foto/15-blagodarnost-2.jpg", from: "Департамент по охране объектов животного мира Кузбасса", what: "Благодарность коллективу «АМР-Мед»" },
      { src: "img/foto/16-blagodarnost-3.jpg", from: "МКУ «ЦОСО г. Кемерово»", what: "Коллективу «АМР-Мед» за проведение медосмотров" },
      { src: "img/foto/17-blagodarnost-4.jpg", from: "«Корпорация АСИ»", what: "Заместителю главного врача «АМР-Мед»" }
    ];
    LETTERS.forEach(function (L, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "doc-item";
      b.setAttribute("aria-label", "Открыть письмо: " + L.from);
      b.innerHTML = '<span class="doc-item__img"><img src="' + base + L.src + '" alt="" loading="lazy"></span>' +
        '<span class="doc-item__cap"><b>' + L.from + '</b><span>' + L.what + '</span></span>';
      b.addEventListener("click", function () { openLb(i); });
      strip.appendChild(b);
    });
    var lb = document.createElement("div");
    lb.className = "lb"; lb.hidden = true; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-label", "Благодарственное письмо");
    lb.innerHTML = '<div class="lb__in"><button class="lb__btn lb__x" aria-label="Закрыть">✕</button><button class="lb__btn lb__prev" aria-label="Предыдущее письмо">‹</button><img class="lb__img" alt=""><button class="lb__btn lb__next" aria-label="Следующее письмо">›</button><p class="lb__cap"></p></div>';
    document.body.appendChild(lb);
    var cur = 0, opener = null, M = LETTERS.length;
    function showLb() {
      $(".lb__img", lb).src = base + LETTERS[cur].src;
      $(".lb__cap", lb).innerHTML = "<b>" + LETTERS[cur].from + "</b><br>" + LETTERS[cur].what + "<br><span style=\"opacity:.7\">Письмо " + (cur + 1) + " из " + M + "</span>";
    }
    function openLb(i) { cur = i; opener = document.activeElement; showLb(); lb.hidden = false; $(".lb__x", lb).focus(); }
    function closeLb() { lb.hidden = true; if (opener && opener.focus) opener.focus(); }
    $(".lb__x", lb).onclick = closeLb;
    $(".lb__prev", lb).onclick = function () { cur = (cur + M - 1) % M; showLb(); };
    $(".lb__next", lb).onclick = function () { cur = (cur + 1) % M; showLb(); };
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
    addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") $(".lb__prev", lb).click();
      if (e.key === "ArrowRight") $(".lb__next", lb).click();
    });
  }

  /* АМР-Мед: открыто ли сейчас (пн–пт 6:30–20:00, вс 8:00–14:00, по времени Кемерово UTC+7) */
  var st = $("[data-open-status]");
  if (st) {
    var now = new Date(), kem = new Date(now.getTime() + (now.getTimezoneOffset() + 420) * 60000);
    var day = kem.getDay(), m = kem.getHours() * 60 + kem.getMinutes(), open = false;
    if (day >= 1 && day <= 5) open = m >= 390 && m < 1200;
    if (day === 0) open = m >= 480 && m < 840;
    st.classList.toggle("is-closed", !open);
    $("b", st).textContent = open ? "Открыто сейчас" : "Сейчас закрыто";
  }

  /* АМР-Мед: подбор формата по числу водителей и месту начала рейса */
  var calc = $("#calc");
  if (calc) {
    var s = { size: "1–5", where: "center" };
    $$(".chips", calc).forEach(function (g) {
      $$(".chip", g).forEach(function (b) {
        b.addEventListener("click", function () {
          $$(".chip", g).forEach(function (x) { x.classList.remove("on"); x.setAttribute("aria-pressed", "false"); });
          b.classList.add("on"); b.setAttribute("aria-pressed", "true");
          s[g.getAttribute("data-q")] = b.getAttribute("data-v"); upd();
        });
      });
    });
    function upd() {
      var big = s.size === "больше 50" || s.size === "16–50", t, r;
      if (s.where === "far") { t = "Дистанционный осмотр на вашей площадке"; r = "Ставим комплекс AMR DIMECO у вас на объекте, медик проверяет показатели онлайн. Так уже работаем для РЖД и в ХМАО."; }
      else if (s.where === "own" || big) { t = "Комплекс AMR DIMECO у вас на предприятии"; r = "Когда водителей " + s.size + ", осмотр удобнее проводить на месте: водители не тратят время на дорогу, а сам осмотр занимает до 30 секунд."; }
      else { t = "Осмотр в центре на Мичурина, 15"; r = "Водитель приходит перед рейсом, проходит осмотр и получает штамп и подпись медика в путевом листе."; }
      $("#calc-title").textContent = t;
      $("#calc-rec").textContent = r;
      $("#calc-hidden").value = s.size + " водителей; " + t;
    }
    upd();
  }
})();
