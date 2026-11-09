/* Сайт ГК «Санэпидаудит-Кузбасс», версия 5 (дизайн по концепции ChatGPT).
   Данные — js/data.js (тот же файл, что в прототипе версии 4). Отправка заявок — js/zayavki.js. */
(function () {
  "use strict";
  var C = window.CONTACT || {}, D = window.DIRECTIONS || [];
  var T = window.typo || function (s) { return s; };
  /* Страницы, которые ещё не перерисованы в новом дизайне, открываем из версии 4 */
  var OLD = "https://paharukova.github.io/prototipy/sanepidaudit-gk/";
  var NEW_PAGES = { lab: "laboratoriya.html" };

  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function t(s) { return esc(T(s)); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function need(s) { return '<span class="need">[уточнить у клиента] ' + t(s) + "</span>"; }
  function ic(n, cls) { return '<svg class="ico' + (cls ? " " + cls : "") + '" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; }
  function dir(id) { for (var i = 0; i < D.length; i++) if (D[i].id === id) return D[i]; return null; }
  function num(i) { return (i < 9 ? "0" : "") + (i + 1); }
  function href(key) {
    if (key === "amr" || key === "med0") return OLD + "amr-med/index.html";
    if (key === "avangard" || key === "med1") return OLD + "avangard-med/index.html";
    if (key === "med") return "index.html#medicina";
    if (NEW_PAGES[key]) return NEW_PAGES[key];
    var d = dir(key);
    return d && d.page ? OLD + d.page : "#";
  }
  function telHref(p) { return "tel:" + String(p).replace(/[^\d+]/g, ""); }
  function steps(d) {
    var h = "";
    for (var i = 0; i < 6; i++) h += "<i" + (i === d.step ? ' style="background:' + d.color + '"' : "") + "></i>";
    return '<span class="steps" aria-hidden="true">' + h + "</span>";
  }
  function dlabel(d) { var i = D.indexOf(d); return '<span class="dnum">' + steps(d) + num(i) + "</span>"; }

  /* Дополнения для карточек: короткие подписи и картинки. Тексты — из data.js и прототипа версии 4. */
  var EXTRA = {
    med: { sub: "Осмотры и справки", co: "«АМР-Мед» и «Авангард-Мед»", tags: ["Предрейсовые осмотры", "Медосмотры сотрудников", "Справки и санкнижки", "Урология и гинекология"], photo: "01-amr-vrach-portret-1.jpg", pos: "center 22%", icon: "pulse", short: "Медицина" },
    lab: { sub: "Замеры и исследования", chip: "Аккредитованная лаборатория", icon: "flask", short: "Лаборатория" },
    proekt: { sub: "СЗЗ и экспертизы", photo: "22-cei-obekt-karer.jpg", pos: "center", cap: "Объект группы «ЦЭИ»", icon: "plan", short: "Проекты" },
    konsalt: { sub: "Подготовка к проверкам", chip: "Документы и аудит", icon: "list", short: "Консалтинг" },
    dez: { sub: "Дезинфекция и защита", chip: "Санитарная защита", icon: "bug", short: "Обработка" },
    util: { sub: "Вывоз своим транспортом", chip: "Медицинские отходы", icon: "bin", short: "Утилизация" }
  };

  /* ---------- Иконки: авторские линейные, 1.5 px ---------- */
  var P = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    "arrow-ur": '<path d="M7 17 17 7M8.5 7H17v8.5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    phone: '<path d="M6.6 3.5h2.8l1.6 4-2.1 1.4a10.6 10.6 0 0 0 6.2 6.2l1.4-2.1 4 1.6v2.8a2 2 0 0 1-2.1 2A16.1 16.1 0 0 1 4.6 5.6a2 2 0 0 1 2-2.1z"/>',
    chat: '<path d="M4 5h16v11H10l-6 4z"/><path d="M8 10h8"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    clip: '<path d="m8.5 12.5 6.4-6.4a3 3 0 0 1 4.2 4.2l-8.3 8.3a5 5 0 0 1-7.1-7.1L11.5 3.7"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
    doc: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>',
    building: '<path d="M4 21V5l8-2v18M12 8h8v13M3 21h18M7.5 8h1M7.5 12h1M7.5 16h1M15.5 12h1M15.5 16h1"/>',
    pulse: '<path d="M3 12h4l2-5 4 10 2-5h6"/>',
    flask: '<path d="M9 3h6M10 3v6l-5 9.2A1.9 1.9 0 0 0 6.7 21h10.6a1.9 1.9 0 0 0 1.7-2.8L14 9V3M7.4 15h9.2"/>',
    plan: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>',
    list: '<path d="M10 6h10M10 12h10M10 18h10"/><path d="m4 6 1.2 1.2L7.5 5M4 12l1.2 1.2L7.5 11M4 18l1.2 1.2L7.5 17"/>',
    bug: '<path d="M8 10a4 4 0 0 1 8 0v4a4 4 0 0 1-8 0z"/><path d="M12 10v8M4 12h4M16 12h4M5 18l3-1.5M19 18l-3-1.5M9.5 6 8 4M14.5 6 16 4"/>',
    bin: '<path d="M4 7h16M9.5 7V4h5v3M6 7l1 14h10l1-14M10 11v6M14 11v6"/>',
    wind: '<path d="M3 9h10.5A2.5 2.5 0 1 0 11 6.5M3 13h15.5a2.5 2.5 0 1 1-2.5 2.5M3 17h7"/>',
    drop: '<path d="M12 3.5s6 6.6 6 10.8a6 6 0 0 1-12 0C6 10.1 12 3.5 12 3.5z"/><path d="M9.5 15a2.5 2.5 0 0 0 2.5 2.5"/>',
    soil: '<path d="M3 12h18M3 16h18M3 20h18"/><path d="M12 12V7M12 8c-2.5 0-4-1.5-4-4 2.5 0 4 1.5 4 4zM12 9c2.5 0 4-1.5 4-4-2.5 0-4 1.5-4 4z"/>',
    sound: '<path d="M4 10v4h4l5 4V6l-5 4z"/><path d="M16 9a4.2 4.2 0 0 1 0 6M18.6 6.4a8 8 0 0 1 0 11.2"/>',
    swab: '<path d="m4.5 19.5 10-10"/><rect x="13.2" y="3.8" width="5" height="9" rx="2.5" transform="rotate(45 15.7 8.3)"/>',
    pin: '<path d="M12 21s7-6.1 7-11.2a7 7 0 0 0-14 0C5 14.9 12 21 12 21z"/><circle cx="12" cy="9.8" r="2.5"/>',
    truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    factory: '<path d="M3 21V11l5 3v-3l5 3v-3l5 3V4h3v17zM3 21h18"/>',
    store: '<path d="m4 9 1.5-5h13L20 9zM4 9v1.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0V9M5.5 13v8h13v-8M10 21v-4h4v4"/>',
    shield: '<path d="M12 3 19 6v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="m9 12 2 2 4-4"/>'
  };
  var sprite = '<svg width="0" height="0" style="position:absolute" aria-hidden="true">';
  for (var k in P) sprite += '<symbol id="i-' + k + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + P[k] + "</symbol>";
  document.body.insertAdjacentHTML("afterbegin", sprite + "</svg>");

  /* ---------- Логотип: шесть ступеней, верхняя — золотая ---------- */
  function sign() {
    var r = "";
    for (var i = 0; i < 6; i++) r += '<rect x="' + (i * 17.65).toFixed(2) + '" y="' + (80 - i * 16) + '" width="14.6" height="' + (16 + i * 16) + '" rx="2.1" fill="' + (i === 5 ? "#C4A24B" : "currentColor") + '"/>';
    return '<svg viewBox="0 0 104 96" aria-hidden="true">' + r + "</svg>";
  }
  $$("[data-brand]").forEach(function (el) {
    el.innerHTML = sign() + "<span><b>САНЭПИДАУДИТ-КУЗБАСС</b><small>Группа компаний · Кемерово</small></span>";
    el.style.color = "var(--charcoal)";
  });

  /* ---------- Ссылки, телефон, мессенджеры ---------- */
  $$("[data-href]").forEach(function (a) { a.href = href(a.getAttribute("data-href")); });
  $$("[data-old]").forEach(function (a) { a.href = OLD; });
  $$("[data-phone]").forEach(function (a) { if (C.phone) a.href = telHref(C.phone); });
  $$("[data-phone-text]").forEach(function (el) { el.textContent = C.phone || ""; });
  $$("[data-answer]").forEach(function (el) { el.textContent = C.answer || ""; });
  $$("[data-dlabel]").forEach(function (el) {
    var d = dir(el.getAttribute("data-dlabel"));
    if (d) el.innerHTML = dlabel(d) + " " + t(d.title);
  });

  var MS = [
    { k: "whatsapp", l: "WhatsApp", href: function (v) { return "https://wa.me/" + String(v).replace(/\D/g, ""); } },
    { k: "telegram", l: "Telegram", href: function (v) { return /^https?:/.test(v) ? v : "https://t.me/" + String(v).replace(/^@/, ""); } },
    { k: "max", l: "MAX", href: function (v) { return v; } }
  ];
  function msgrHtml() {
    return MS.map(function (m) {
      var v = C[m.k];
      return '<a class="mbtn mbtn-' + m.k + '" href="' + (v ? esc(m.href(v)) : "#") + '"' + (v ? ' target="_blank" rel="noopener"' : ' data-need="' + m.l + '"') + '><span class="dot"></span>' + m.l + "</a>";
    }).join("");
  }
  $$("[data-msgr]").forEach(function (el) { el.innerHTML = msgrHtml(); });

  var toastEl = document.createElement("div");
  toastEl.className = "toast"; toastEl.setAttribute("role", "status");
  document.body.appendChild(toastEl);
  var toastTimer;
  function toast(s) {
    toastEl.textContent = s; toastEl.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-need]");
    if (!a) return;
    e.preventDefault();
    toast("Прототип: здесь будет ссылка на " + a.getAttribute("data-need") + " — ждём контакт от заказчика");
  });

  /* ---------- Шапка, мобильное меню ---------- */
  var top = $(".top");
  function onScroll() { if (top) top.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  var burger = $(".burger"), mnav = $("#mnav");
  if (burger && mnav) {
    burger.addEventListener("click", function () {
      var open = !mnav.classList.contains("open");
      mnav.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open);
      burger.innerHTML = ic(open ? "close" : "menu");
      document.body.style.overflow = open ? "hidden" : "";
    });
    mnav.addEventListener("click", function (e) {
      if (e.target.closest("a")) { mnav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); burger.innerHTML = ic("menu"); document.body.style.overflow = ""; }
    });
  }

  /* ---------- Главная: каталог направлений ---------- */
  var cat = $("#catalog");
  if (cat) {
    cat.innerHTML = D.map(function (d) {
      var x = EXTRA[d.id] || {};
      var pic = x.photo
        ? '<div class="dcard-pic photo" style="background-image:url(\'img/foto/' + x.photo + "');background-position:" + x.pos + '">' + (x.cap ? '<span class="cap">' + t(x.cap) + "</span>" : "") + "</div>"
        : '<div class="dcard-pic"><span class="chip">' + ic(x.icon) + t(x.chip) + "</span></div>";
      var tags = (x.tags || d.tags || []).slice(0, 4);
      return '<a class="dcard" href="' + href(d.id) + '">' + pic +
        '<div class="dcard-body">' + dlabel(d) +
        "<h4>" + t(d.title) + "</h4>" +
        '<p class="co">' + t(d.company || x.co) + "</p>" +
        '<ul class="tags">' + tags.map(function (g) { return '<li class="tag">' + t(g) + "</li>"; }).join("") + "</ul>" +
        '<div class="dcard-foot">Подробнее<span class="round-arrow">' + ic("arrow-ur") + "</span></div></div></a>";
    }).join("") +
      '<div class="dcard-help"><div><p class="caps gold">Подбор</p><h3 style="margin-top:10px">Не&nbsp;знаете, какое направление нужно?</h3>' +
      "<p>" + t("Опишите задачу или приложите предписание — сотрудник группы разберётся и передаст заявку в компанию, которая её решит.") + "</p></div>" +
      '<div class="row"><a class="btn btn-gold" href="#zayavka" data-pick="help">Помогите выбрать ' + ic("arrow") + "</a>" +
      (C.phone ? '<a class="btn btn-ghost-dark" href="' + telHref(C.phone) + '">' + ic("phone") + esc(C.phone) + "</a>" : "") + "</div></div>";
  }

  /* Задачи */
  var tasks = $("#tasks");
  if (tasks && window.TASKS) {
    tasks.innerHTML = TASKS.map(function (x, i) {
      var d = dir(x.to), key = x.to === "med" ? "med" + x.org : x.to;
      var to = x.to === "med" ? d.orgs[x.org].full : d.title + " · " + d.company;
      return '<a class="task" href="' + href(key) + '"><span class="dnum">' + steps(d) + "</span><span><b>" + t(x.q) + "</b><small>" + t(to) + '</small></span><span class="round-arrow">' + ic("arrow") + "</span></a>";
    }).join("");
  }

  /* Ступени-навигация в блоке «О группе» */
  var st = $("#stairs");
  if (st) {
    var byStep = D.slice().sort(function (a, b) { return a.step - b.step; });
    st.innerHTML = byStep.map(function (d) {
      return '<a href="' + href(d.id) + '" title="' + esc(d.title) + '"><em>' + num(D.indexOf(d)) + '</em><span class="st' + (d.step === 5 ? " st-top" : "") + '" style="height:' + Math.round((d.step + 1) / 6 * 200) + "px;--dc:" + d.color + '"></span></a>';
    }).join("");
    $("#stairs-legend").innerHTML = byStep.map(function (d) { return "<span><i>" + num(D.indexOf(d)) + "</i>" + t(EXTRA[d.id].short) + "</span>"; }).join("");
  }

  /* Как работаем */
  var how = $("#how");
  if (how && window.HOW) {
    how.innerHTML = HOW.map(function (s) {
      return "<li><h4>" + t(s.t) + "</h4><p>" + t(s.d) + "</p>" + (s.need ? need(s.need) : "") + "</li>";
    }).join("");
  }

  /* Отзывы, клиенты, письма */
  var rv = $("#reviews");
  if (rv && window.REVIEWS) {
    rv.innerHTML = REVIEWS.map(function (r) {
      return '<figure class="review" style="margin:0"><blockquote class="q" style="margin:0">' + t(r.q) + '</blockquote><figcaption class="who"><span>' + t(r.who) + '</span><a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.src) + ic("arrow-ur") + "</a></figcaption></figure>";
    }).join("");
  }
  var cl = $("#clients");
  if (cl && window.CLIENTS) cl.innerHTML = CLIENTS.map(function (c) { return "<span>" + t(c) + "</span>"; }).join("");
  var LETTER_SCANS = [
    { img: "14-blagodarnost-1.jpg", t: "ООО «Центр оценки и экспертиз» — коллективу «АМР-Мед»" },
    { img: "15-blagodarnost-2.jpg", t: "Департамент по охране объектов животного мира Кузбасса — коллективу «АМР-Мед»" },
    { img: "16-blagodarnost-3.jpg", t: "МКУ «Центр организации социального обслуживания г. Кемерово» — коллективу «АМР-Мед»" },
    { img: "17-blagodarnost-4.jpg", t: "Корпорация АСИ — заместителю главного врача «АМР-Мед»" }
  ];
  var lt = $("#letters");
  if (lt) {
    lt.innerHTML = LETTER_SCANS.map(function (l) {
      return '<button class="letter" type="button" data-zoom="img/foto/' + l.img + '" data-cap="' + esc(l.t) + '"><img src="img/foto/' + l.img + '" alt="Благодарственное письмо: ' + esc(l.t) + '" loading="lazy"><span>' + t(l.t) + "</span></button>";
    }).join("");
    if (window.LETTERS) $("#letters-more").innerHTML = t("Ещё письма на medosmotr42.ru: " + LETTERS.join("; ") + ".") + " " + need("сканы писем других направлений");
  }

  /* Увеличение документов */
  var lb = document.createElement("div");
  lb.className = "lightbox"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-label", "Просмотр документа");
  lb.innerHTML = '<button class="close" type="button" aria-label="Закрыть">' + ic("close") + "</button><figure><img alt=\"\"><figcaption></figcaption></figure>";
  document.body.appendChild(lb);
  var lastFocus;
  function closeLb() { lb.classList.remove("open"); if (lastFocus) lastFocus.focus(); }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-zoom]");
    if (b) {
      lastFocus = b;
      $("img", lb).src = b.getAttribute("data-zoom"); $("img", lb).alt = b.getAttribute("data-cap");
      $("figcaption", lb).textContent = b.getAttribute("data-cap");
      lb.classList.add("open"); $(".close", lb).focus();
    } else if (e.target === lb || e.target.closest(".lightbox .close")) closeLb();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && lb.classList.contains("open")) closeLb(); });

  /* Для кого */
  var who = $("#who");
  if (who && window.WHO) {
    var WI = ["pulse", "truck", "factory", "store"];
    who.innerHTML = WHO.map(function (w, i) {
      return '<div class="who-card">' + ic(WI[i] || "check") + "<h4>" + t(w.t) + "</h4><ul>" + w.items.map(function (it) {
        var key = it[1], d = dir(key.indexOf("med") === 0 ? "med" : key);
        return '<li><a href="' + href(key) + '"><span>' + t(it[0]) + '</span><i style="background:' + d.color + '"></i></a></li>';
      }).join("") + "</ul></div>";
    }).join("");
  }

  /* Частые вопросы */
  function faqHtml(list) {
    return list.map(function (f) {
      return "<details><summary>" + t(f.q) + ic("plus") + "</summary><p>" + (f.a ? t(f.a) : need(f.need)) + "</p></details>";
    }).join("");
  }
  var fq = $("#faq");
  if (fq && window.FAQ) fq.innerHTML = faqHtml(FAQ);

  /* Контакты по направлениям */
  var ct = $("#contacts");
  if (ct) {
    var cards = [];
    D.forEach(function (d) {
      if (d.orgs) d.orgs.forEach(function (o, i) {
        cards.push({ d: d, name: o.name, co: o.full, addr: o.address, phone: o.phone, hours: null, key: "med" + i });
      });
      else cards.push({ d: d, name: d.title, co: d.company, addr: d.address, phone: d.phone, hours: d.hours, key: d.id });
    });
    ct.innerHTML = cards.map(function (c) {
      return '<div class="ccard">' + dlabel(c.d) + '<h4><a href="' + href(c.key) + '">' + t(c.name) + '</a></h4><p class="co">' + t(c.co) + "</p><dl>" +
        "<dt>Адрес</dt><dd>" + t(c.addr) + "</dd>" +
        "<dt>Телефон</dt><dd>" + (c.phone ? '<a class="mono" href="' + telHref(c.phone) + '">' + esc(c.phone) + "</a>" : need("телефон")) + "</dd>" +
        "<dt>Часы</dt><dd>" + (c.hours ? t(c.hours) : need("часы")) + "</dd></dl></div>";
    }).join("") +
      '<div class="ccard" style="background:var(--charcoal);border-color:var(--charcoal);color:#C9C4BB"><p class="caps gold">Не&nbsp;знаете, куда звонить</p><h4 style="color:#F4F2EF;margin-top:8px">Поможем выбрать компанию</h4><p class="small" style="margin-top:6px">' + t("Опишите задачу — передадим её в нужную компанию группы.") + '</p><a class="btn btn-gold" href="#zayavka" data-pick="help" style="margin-top:auto">Оставить заявку</a></div>';
  }

  /* Таблица компаний */
  function dirOfCompany(name) {
    for (var i = 0; i < D.length; i++) {
      var d = D[i];
      if (d.company === name) return d;
      if (d.orgs) for (var j = 0; j < d.orgs.length; j++) if (d.orgs[j].full === name) return d;
    }
    return null;
  }
  var cb = $("#companies");
  if (cb && window.COMPANIES) {
    cb.innerHTML = COMPANIES.map(function (c) {
      var d = dirOfCompany(c.name);
      return "<tr><td><b style=\"font-weight:500\">" + t(c.name) + '</b></td><td><span class="dir"><i style="background:' + (d ? d.color : "#ccc") + '"></i>' + t(c.dir) + '</span></td><td><span class="mono">' + c.inn + '</span></td><td><span class="mono">' + c.ogrn + "</span></td><td>" + t(c.addr) + "</td></tr>";
    }).join("");
    $("#co-cards").innerHTML = COMPANIES.map(function (c) {
      return '<div class="co-card"><b>' + t(c.name) + '</b><dl><dt>Направл.</dt><dd>' + t(c.dir) + '</dd><dt>ИНН</dt><dd class="mono">' + c.inn + '</dd><dt>ОГРН</dt><dd class="mono">' + c.ogrn + "</dd><dt>Адрес</dt><dd>" + t(c.addr) + "</dd></dl></div>";
    }).join("");
  }

  /* ---------- Подвал ---------- */
  var ft = $("[data-footer]");
  if (ft) {
    var onHome = !!$("#catalog");
    var hp = onHome ? "" : "index.html";
    ft.innerHTML = '<div class="wrap">' +
      '<div class="about-f"><a class="brand" href="index.html" style="color:#F4F2EF">' + sign() + "<span><b>САНЭПИДАУДИТ-КУЗБАСС</b><small>Группа компаний · Кемерово</small></span></a>" +
      "<p>" + t("Сайт группы компаний работает от имени ООО МФЦ «Санэпидаудит-Кузбасс», ИНН 4205349209, ОГРН 1164205085967. Кемерово, ул. 1-я Стахановская, 39а, офис 202.") + "</p></div>" +
      "<div><h4>Направления</h4><ul>" +
      '<li><a href="' + href("amr") + '">Медицина: АМР-Мед</a></li><li><a href="' + href("avangard") + '">Медицина: Авангард-Мед</a></li>' +
      D.filter(function (d) { return d.page; }).map(function (d) { return '<li><a href="' + href(d.id) + '">' + t(d.title) + "</a></li>"; }).join("") + "</ul></div>" +
      "<div><h4>Разделы</h4><ul>" +
      '<li><a href="' + hp + '#o-gruppe">О группе</a></li><li><a href="' + hp + '#osnovateli">Основатели</a></li><li><a href="' + hp + '#voprosy">Частые вопросы</a></li><li><a href="' + hp + '#zakupki">Участникам закупок</a></li><li><a href="' + hp + '#yurlica">Компании группы</a></li><li><a href="#">Политика обработки персональных данных</a></li></ul></div>' +
      "<div><h4>Связаться</h4><ul>" + (C.phone ? '<li><a class="mono" href="' + telHref(C.phone) + '">' + esc(C.phone) + "</a></li>" : "") +
      '<li><a href="#zayavka">Оставить заявку</a></li></ul><div class="msgr">' + msgrHtml() + "</div></div>" +
      '<div class="fine"><span>© <span>' + new Date().getFullYear() + "</span> ГК «Санэпидаудит-Кузбасс»</span><span>Дизайн-макет: формы ничего не&nbsp;отправляют</span></div></div>";
  }

  /* ---------- Мобильная нижняя панель ---------- */
  var bar = document.createElement("nav");
  bar.className = "mbar"; bar.setAttribute("aria-label", "Быстрая связь");
  bar.innerHTML = '<a href="' + (C.phone ? telHref(C.phone) : "#") + '">' + ic("phone") + "Позвонить</a>" +
    '<button type="button" aria-expanded="false" aria-controls="mbar-pop">' + ic("chat") + "Написать</button>" +
    '<a class="go" href="#zayavka">' + ic("doc") + "Заявка</a>" +
    '<div class="mbar-pop" id="mbar-pop" hidden>' + msgrHtml() + "</div>";
  document.body.appendChild(bar);
  var mbBtn = $("button", bar), mbPop = $(".mbar-pop", bar);
  mbBtn.addEventListener("click", function () {
    var o = mbPop.hidden; mbPop.hidden = !o; mbBtn.setAttribute("aria-expanded", o);
  });
  document.addEventListener("click", function (e) {
    if (!mbPop.hidden && !e.target.closest(".mbar")) { mbPop.hidden = true; mbBtn.setAttribute("aria-expanded", "false"); }
  });

  /* ---------- Метки рекламы: запоминаем при первом заходе и добавляем в заявку ---------- */
  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "yclid"];
  var utm = {};
  try { utm = JSON.parse(sessionStorage.getItem("gk-utm") || "{}"); } catch (e) {}
  var qs = new URLSearchParams(location.search), gotNew = false;
  UTM_KEYS.forEach(function (k) { if (qs.get(k)) { utm[k] = qs.get(k); gotNew = true; } });
  if (gotNew) try { sessionStorage.setItem("gk-utm", JSON.stringify(utm)); } catch (e) {}
  function utmText() {
    if (!utm.utm_source && !utm.yclid) return "заход без рекламной метки";
    return "реклама " + (utm.utm_source || "Яндекс") + (utm.utm_campaign ? ", кампания «" + utm.utm_campaign + "»" : "");
  }

  /* ---------- Формы ---------- */
  var OPTS = [{ v: "help", l: "Не знаю — помогите выбрать" }];
  D.forEach(function (d) {
    if (d.orgs) d.orgs.forEach(function (o, i) { OPTS.push({ v: "med" + i, l: "Медицина: " + o.name }); });
    else OPTS.push({ v: d.id, l: d.title });
  });
  function recipient(v) {
    if (v === "help") return null;
    if (v.indexOf("med") === 0) return dir("med").orgs[+v.slice(3)].full;
    var d = dir(v); return d ? d.company : null;
  }

  function fullForm(preset) {
    return '<div class="row2">' +
      '<label class="field"><span class="lbl">Имя</span><input class="input" type="text" name="name" autocomplete="name" placeholder="Как к вам обращаться" data-req="name"><span class="err">Напишите, как к&nbsp;вам обращаться</span></label>' +
      '<label class="field"><span class="lbl">Телефон</span><input class="input" type="tel" name="phone" autocomplete="tel" inputmode="tel" placeholder="+7 (___) ___-__-__" data-req="phone"><span class="err">Нужен номер из&nbsp;11 цифр, например +7 (900) 123-45-67</span></label></div>' +
      '<fieldset class="way"><legend>Как удобнее связаться</legend><div class="way-opts">' +
      ["Звонок", "WhatsApp", "Telegram", "MAX"].map(function (w, i) { return '<label><input type="radio" name="way" value="' + w + '"' + (i ? "" : " checked") + "><span>" + w + "</span></label>"; }).join("") + "</div></fieldset>" +
      '<label class="field"><span class="lbl">Направление</span><select class="input" name="direction">' +
      OPTS.map(function (o) { return '<option value="' + o.v + '"' + (o.v === preset ? " selected" : "") + ">" + esc(o.l) + "</option>"; }).join("") + "</select></label>" +
      '<p class="route" aria-live="polite"></p>' +
      '<label class="field"><span class="lbl">Задача <span class="opt">— необязательно</span></span><textarea class="input" name="task" placeholder="Например: периодический медосмотр 40 сотрудников с выездом на предприятие в декабре"></textarea></label>' +
      '<details class="more-fields"><summary>Добавить организацию и файл' + ic("plus") + '</summary><div class="inner">' +
      '<label class="field"><span class="lbl">Организация <span class="opt">— необязательно</span></span><input class="input" type="text" name="org" placeholder="Название компании или ИП" autocomplete="organization"></label>' +
      '<label class="field"><span class="lbl">Файл <span class="opt">— предписание, ТЗ, до 10 МБ</span></span><input class="input" type="file" name="file" style="padding-top:11px" data-req="file"><span class="err">Файл больше 10 МБ — пришлите его в мессенджер</span></label></div></details>' +
      '<label class="field check"><input type="checkbox" name="consent" data-req="consent"><span>Согласен на&nbsp;обработку персональных данных по&nbsp;<a href="#">политике</a></span><span class="err" style="grid-column:2">Отметьте согласие, без&nbsp;него не&nbsp;можем принять заявку</span></label>' +
      '<button class="btn btn-gold btn-block" type="submit">Отправить заявку ' + ic("arrow") + "</button>" +
      '<div class="form-done" role="status"></div>';
  }
  $$('form[data-form="full"]').forEach(function (f) { f.innerHTML = fullForm(f.getAttribute("data-preset") || "help"); });

  function updRoute(f) {
    var sel = $('[name="direction"]', f), r = $(".route", f);
    if (!sel || !r) return;
    var to = recipient(sel.value);
    r.innerHTML = to ? "Заявку получит <b>" + t(to) + "</b>" : "Заявку получит сотрудник группы и передаст в нужную компанию " + need("кто это");
  }
  $$("form[data-form]").forEach(function (f) {
    updRoute(f);
    var sel = $('[name="direction"]', f);
    if (sel && sel.tagName === "SELECT") sel.addEventListener("change", function () { updRoute(f); });
  });

  /* Кнопки «Помогите выбрать», карточки услуг: выбираем направление и задачу в большой форме */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-pick],[data-task]");
    if (!a) return;
    var f = $('form[data-form="full"]');
    if (!f) return;
    var sel = $('[name="direction"]', f);
    if (a.hasAttribute("data-pick") && sel) { sel.value = a.getAttribute("data-pick"); updRoute(f); }
    if (a.hasAttribute("data-task")) $('[name="task"]', f).value = a.getAttribute("data-task");
  });

  function digits(s) { return String(s).replace(/\D/g, ""); }
  function normPhone(v) {
    var d = digits(v);
    if (d.length === 10) d = "7" + d;
    if (d.length === 11 && d[0] === "8") d = "7" + d.slice(1);
    return d;
  }
  function fmtPhone(v) {
    var d = digits(v);
    if (!d) return "";
    if (d[0] === "8") d = "7" + d.slice(1);
    if (d[0] !== "7") d = "7" + d;
    d = d.slice(0, 11);
    var s = "+7";
    if (d.length > 1) s += " (" + d.slice(1, 4);
    if (d.length >= 4) s += ")";
    if (d.length > 4) s += " " + d.slice(4, 7);
    if (d.length > 7) s += "-" + d.slice(7, 9);
    if (d.length > 9) s += "-" + d.slice(9, 11);
    return s;
  }
  function check(el) {
    var k = el.getAttribute("data-req"), ok = true;
    if (k === "name") ok = el.value.trim().length >= 2;
    if (k === "phone") { var p = normPhone(el.value); ok = p.length === 11 && p[0] === "7"; }
    if (k === "consent") ok = el.checked;
    if (k === "file") ok = !el.files || !el.files[0] || el.files[0].size <= 10 * 1024 * 1024;
    var box = el.closest(".field");
    if (box) box.classList.toggle("invalid", !ok);
    el.setAttribute("aria-invalid", ok ? "false" : "true");
    return ok;
  }
  document.addEventListener("input", function (e) {
    var el = e.target;
    if (el.matches && el.matches('input[type="tel"]') && e.inputType !== "deleteContentBackward") el.value = fmtPhone(el.value);
    if (el.closest && el.closest(".field.invalid") && el.hasAttribute("data-req")) check(el);
  });
  document.addEventListener("change", function (e) {
    var el = e.target;
    if (el.hasAttribute && el.hasAttribute("data-req") && (el.type === "checkbox" || el.type === "file")) check(el);
  });
  document.addEventListener("focusout", function (e) {
    var el = e.target;
    if (el.hasAttribute && el.hasAttribute("data-req") && el.type !== "checkbox" && el.value) check(el);
  });

  $$("form[data-form]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = $$("[data-req]", f).filter(function (el) { return !check(el); });
      if (bad.length) {
        if (bad[0].type === "file") { var det = bad[0].closest("details"); if (det) det.open = true; }
        bad[0].focus();
        return;
      }
      var data = {};
      $$("input, select, textarea", f).forEach(function (el) {
        if (!el.name || (el.type === "radio" && !el.checked)) return;
        if (el.type === "checkbox") data[el.name] = el.checked;
        else if (el.type === "file") data[el.name] = el.files && el.files[0] ? el.files[0].name : "";
        else data[el.name] = el.value.trim();
      });
      data.phone = "+" + normPhone(data.phone);
      data.to = recipient(data.direction || "help") || "сотрудник группы";
      data.page = location.pathname;
      UTM_KEYS.forEach(function (k) { if (utm[k]) data[k] = utm[k]; });
      var btn = $('button[type="submit"]', f), label = btn.innerHTML;
      btn.disabled = true; btn.textContent = "Отправляем…";
      window.sendLead(data).then(function () {
        var done = $(".form-done", f);
        done.innerHTML = "<b>" + ic("check") + "Заявка принята</b><p>" +
          t("Перезвоним за " + (C.answer || "15 минут") + " в рабочее время. Заявку получит: " + data.to + ".") + "</p><p class=\"hint\">" +
          t("Это прототип — заявка никуда не ушла. На готовом сайте в заявке будет видно, откуда пришёл клиент: " + utmText() + ".") + "</p>";
        f.classList.add("sent");
        done.setAttribute("tabindex", "-1"); done.focus();
      }).catch(function () {
        btn.disabled = false; btn.innerHTML = label;
        toast("Не получилось отправить. Позвоните нам или напишите в мессенджер.");
      });
    });
  });

  /* ================= Страница направления ================= */
  var page = document.body.getAttribute("data-dir");
  var pd = page ? dir(page) : null;
  if (pd) {
    var px = EXTRA[pd.id] || {};
    document.documentElement.style.setProperty("--dc", pd.color);
    $$("[data-d]").forEach(function (el) {
      var k = el.getAttribute("data-d");
      if (k === "label") el.innerHTML = dlabel(pd) + " " + t(pd.company);
      if (k === "title") el.textContent = T(pd.h1);
      if (k === "lead") el.textContent = T(pd.lead);
      if (k === "crumb") el.textContent = pd.title;
      if (k === "cta") el.textContent = T(pd.cta);
      if (k === "tags") el.innerHTML = (pd.tags || []).map(function (g) { return '<li class="tag">' + t(g) + "</li>"; }).join("");
      if (k === "geo") el.textContent = T(pd.geo || "");
      if (k === "line") el.style.background = pd.color;
    });
    var info = $("#d-info");
    if (info) info.innerHTML =
      "<dt>Компания</dt><dd>" + t(pd.company) + "</dd>" +
      "<dt>Адрес</dt><dd>" + t(pd.address) + "</dd>" +
      "<dt>Телефон</dt><dd>" + (pd.phone ? '<a class="mono" href="' + telHref(pd.phone) + '">' + esc(pd.phone) + "</a>" : need("телефон")) + "</dd>" +
      "<dt>Часы</dt><dd>" + (pd.hours ? t(pd.hours) : need("часы работы")) + "</dd>" +
      "<dt>Ответственный</dt><dd>" + need("имя и прямой телефон") + "</dd>";

    var proc = $("#d-process");
    if (proc && pd.process) proc.innerHTML = pd.process.map(function (s) { return "<li><b>" + t(s) + "</b></li>"; }).join("");

    var dfaq = $("#d-faq");
    if (dfaq) {
      var list = (pd.faq || []).map(function (x) { return { q: x[0], a: x[1] }; });
      (window.FAQ || []).slice(1, 2).forEach(function (f) { list.push(f); });
      dfaq.innerHTML = faqHtml(list);
    }

    var oth = $("#d-others");
    if (oth) {
      var items = [{ key: "amr", n: "АМР-Мед", s: "Предрейсовые осмотры, урология и гинекология", d: dir("med") },
                   { key: "avangard", n: "Авангард-Мед", s: "Медосмотры, справки и санкнижки", d: dir("med") }];
      D.forEach(function (d) { if (d.page && d.id !== pd.id) items.push({ key: d.id, n: d.title, s: (EXTRA[d.id] || {}).sub, d: d }); });
      oth.innerHTML = items.map(function (o) {
        return '<a class="other" href="' + href(o.key) + '">' + dlabel(o.d) + "<b>" + t(o.n) + "</b><small>" + t(o.s) + '</small><span class="round-arrow">' + ic("arrow-ur") + "</span></a>";
      }).join("");
    }
  }
})();
