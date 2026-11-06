(function () {
  var T = window.typo || function (s) { return s; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var fmt = function (n) { return n.toLocaleString("ru-RU").replace(/\s/g, " "); };
  var secName = function (id) { var s = SECTIONS.find(function (x) { return x.id === id; }); return s ? s.name : ""; };
  var ST = { in: ["in", "В наличии"], few: ["few", "Мало на складе"], order: ["order", "Под заказ"] };
  var tones = ["", "small", "tau", "big"];

  var LOGO = '<svg viewBox="0 0 46 40" aria-hidden="true"><path d="M5 38V18a18 18 0 0 1 36 0v20" fill="none" stroke="#1E1916" stroke-width="2.4"/><path d="M9 38V19a14 14 0 0 1 14-14v33z" fill="#5B1E27"/><path d="M23 5a14 14 0 0 1 14 14v19H23z" fill="#A6977C"/><path d="M12 38v-9a3.5 3.5 0 0 1 7 0v9z" fill="#5F7B53"/><path d="M27 38v-8a2.5 2.5 0 0 1 5 0v8z" fill="#4A3426"/><path d="M2 38.5h42" stroke="#1E1916" stroke-width="2.4"/></svg>';

  /* Шапка и подвал — одни на все страницы */
  var page = document.body.dataset.page;
  var link = function (href, text, key) { return '<a href="' + href + '"' + (page === key ? ' class="on"' : "") + ">" + text + "</a>"; };
  var head = document.getElementById("site-head");
  if (head) head.innerHTML =
    '<div class="top"><div class="wrap"><span class="open-now" id="open-now"><i></i><span>Пн–Пт 10:00–19:00, Сб–Вс 10:00–17:00</span></span>' +
    '<span>пр. Михаила Нагибина, 30Л · дизайн-центр WEST, цокольный этаж</span></div></div>' +
    '<header class="site"><div class="wrap"><a class="logo" href="index.html">' + LOGO + '<span><b>МАРТдекор</b><small>интерьерный салон</small></span></a>' +
    '<nav class="main">' + link("catalog.html", "Каталог", "catalog") + link("index.html#touch", "Образцы на объект", "") + link("index.html#pro", "Дизайнерам", "") + link("index.html#tips", "Советы", "") + link("index.html#visit", "Контакты", "") + "</nav>" +
    '<div class="head-cta"><a class="phone" href="tel:+79094200420">+7 (909) 420‑04‑20</a><a class="btn btn-main" href="index.html#lead">Подобрать материал</a></div></div></header>';

  var foot = document.getElementById("site-foot");
  if (foot) foot.innerHTML = T(
    '<div class="wrap"><div><a class="logo" href="index.html">' + LOGO + '<span><b>МАРТдекор</b><small>интерьерный салон</small></span></a>' +
    '<p style="margin-top:16px">Современные стеновые покрытия, лепнина и декор для интерьера. Ростов-на-Дону.</p></div>' +
    '<div><h5>Каталог</h5>' + SECTIONS.map(function (s) { return '<a href="catalog.html?s=' + s.id + '">' + s.name + "</a>"; }).join("") + "</div>" +
    '<div><h5>Салон</h5><a href="index.html#touch">Образцы на объект</a><a href="index.html#pro">Дизайнерам</a><a href="index.html#tips">Советы</a><a href="index.html#faq">Вопросы</a></div>' +
    '<div><h5>Контакты</h5><a href="tel:+79094200420">+7 (909) 420‑04‑20</a><a href="tel:+79094209420">+7 (909) 420‑94‑20</a><a href="mailto:info@martdecor.ru">info@martdecor.ru</a><a href="https://vk.ru/martdecoronline">ВКонтакте</a><a href="https://t.me/martdecorrostov">Telegram</a></div>' +
    '<div class="bottom"><span>Прототип сайта · данные из группы ВКонтакте МАРТдекор, ноябрь 2026 · наличие показано для примера</span><span>Прототип подготовила Татьяна</span></div></div>');

  /* Открыто сейчас — по времени Ростова (UTC+3) */
  var on = document.getElementById("open-now");
  if (on) {
    var now = new Date(Date.now() + (new Date().getTimezoneOffset() + 180) * 60000);
    var d = now.getDay(), m = now.getHours() * 60 + now.getMinutes();
    var close = (d === 0 || d === 6) ? 17 * 60 : 19 * 60;
    var isOpen = m >= 600 && m < close;
    on.classList.toggle("is-open", isOpen);
    on.querySelector("span").textContent = isOpen ? "Открыто до " + (close / 60) + ":00" : "Сейчас закрыто · откроемся в 10:00";
  }

  /* Карточка товара в сетке */
  function card(it, i) {
    var st = ST[it.status];
    return '<a class="card reveal" href="item.html?id=' + it.id + '">' +
      '<div class="ph arch-ph ' + tones[i % 4] + '"><span>фото товара</span></div>' +
      '<div class="body"><div class="sec">' + T(secName(it.section)) + "</div><h4>" + T(it.name) + '</h4><div class="short">' + T(it.short) + "</div>" +
      '<div class="bottom"><span class="price">' + fmt(it.price) + " ₽" + (it.unit ? "/" + it.unit : "") + '</span><span class="st ' + st[0] + '">' + st[1] + "</span></div></div></a>";
  }
  window.renderCard = card;

  /* Главная */
  var cats = $("#cats");
  if (cats) cats.innerHTML = SECTIONS.map(function (s) {
    return '<a class="cat reveal" href="catalog.html?s=' + s.id + '"><span class="ic"><i class="ti ' + s.icon + '"></i></span><h3>' + T(s.name) + "</h3>" +
      '<div class="from">' + (s.from ? "от " + fmt(s.from) + " ₽ <small>" + s.unit + "</small>" : "Цена по запросу") + "</div><p>" + T(s.fact) + '</p><span class="go">Смотреть →</span></a>';
  }).join("");
  var pop = $("#popular");
  if (pop) pop.innerHTML = ["ak-grafit", "pu-hill", "duro-904-70", "gyp-stells"].map(function (id, i) {
    return card(ITEMS.find(function (x) { return x.id === id; }), i);
  }).join("");
  var tips = $("#tips-list");
  if (tips) tips.innerHTML = ARTICLES.map(function (a, i) {
    return '<a class="tip reveal" href="article.html?id=' + a.id + '"><div class="arch-ph ' + tones[(i + 1) % 4] + '"><span>фото из поста</span></div><div class="t"><h3>' + T(a.title) + "</h3><p>" + T(a.lead) + "</p></div></a>";
  }).join("");
  var faq = $("#faq-list");
  if (faq) faq.innerHTML = FAQ.map(function (q) {
    return "<details><summary>" + T(q[0]) + "</summary><p>" + T(q[1]) + "</p><small>Источник: " + q[2] + "</small></details>";
  }).join("");

  /* Каталог */
  var grid = $("#catalog-grid");
  if (grid) {
    var params = new URLSearchParams(location.search);
    var state = { s: params.get("s") || "all", q: "", mat: [], place: [], max: 11000 };
    var tabs = $("#tabs");
    tabs.innerHTML = '<button data-s="all">Все</button>' + SECTIONS.map(function (s) { return '<button data-s="' + s.id + '">' + T(s.name) + "</button>"; }).join("");
    var mats = Array.from(new Set(ITEMS.map(function (i) { return i.material; })));
    $("#f-mat").innerHTML = mats.map(function (m) { return '<label><input type="checkbox" value="' + m + '"> ' + m + "</label>"; }).join("");
    var draw = function () {
      tabs.querySelectorAll("button").forEach(function (b) { b.classList.toggle("on", b.dataset.s === state.s); });
      var list = ITEMS.filter(function (i) {
        return (state.s === "all" || i.section === state.s) &&
          (!state.q || (i.name + " " + i.short).toLowerCase().indexOf(state.q) >= 0) &&
          (!state.mat.length || state.mat.indexOf(i.material) >= 0) &&
          (!state.place.length || state.place.some(function (p) { return i.place.indexOf(p) >= 0; })) &&
          i.price <= state.max;
      });
      $("#count").textContent = "Показано позиций: " + list.length + " · в каталоге ВКонтакте их 328, на сайте будут все";
      grid.innerHTML = list.length ? list.map(card).join("") : '<div class="empty">Ничего не нашлось. Сбросьте фильтры или <a href="index.html#lead">спросите менеджера</a> — подберём под проект.</div>';
      if (state.s === "decor") grid.innerHTML = '<div class="empty" style="grid-column:1/-1">Лепнина, профили и краски — в салоне от 90+ производителей. <div class="need" style="margin-top:14px;text-align:left"><i class="ti ti-pencil"></i><span><b>Нужно от вас:</b> выгрузка позиций этого раздела с ценами — в каталоге ВКонтакте их нет.</span></div></div>';
      reveal();
    };
    tabs.addEventListener("click", function (e) { if (e.target.dataset.s) { state.s = e.target.dataset.s; draw(); } });
    $("#q").addEventListener("input", function (e) { state.q = e.target.value.trim().toLowerCase(); draw(); });
    $("#f-mat").addEventListener("change", function () { state.mat = Array.from(document.querySelectorAll("#f-mat input:checked")).map(function (x) { return x.value; }); draw(); });
    $("#f-place").addEventListener("change", function () { state.place = Array.from(document.querySelectorAll("#f-place input:checked")).map(function (x) { return x.value; }); draw(); });
    $("#f-max").addEventListener("input", function (e) { state.max = +e.target.value; $("#f-max-v").textContent = "до " + fmt(state.max) + " ₽"; draw(); });
    draw();
  }

  /* Карточка позиции */
  var itemBox = $("#item");
  if (itemBox) {
    var id = new URLSearchParams(location.search).get("id");
    var it = ITEMS.find(function (x) { return x.id === id; }) || ITEMS[0];
    var st = ST[it.status];
    document.title = it.name + " — МАРТдекор";
    var li = function (a) { return a.map(function (x) { return "<li>" + T(x) + "</li>"; }).join(""); };
    itemBox.innerHTML =
      '<div class="gal"><div class="arch-ph big"><span>фото товара в интерьере</span></div><div class="thumbs">' +
      ["вблизи", "фактура", "в интерьере", "образец"].map(function (t, i) { return '<div class="arch-ph ' + tones[i] + '"><span>' + t + "</span></div>"; }).join("") + "</div></div>" +
      '<div><div class="crumbs"><a href="index.html">Главная</a> / <a href="catalog.html?s=' + it.section + '">' + T(secName(it.section)) + "</a></div>" +
      "<h1>" + T(it.name) + '</h1><p class="muted">' + T(it.short) + "</p>" +
      '<div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap"><span class="price">' + fmt(it.price) + " ₽</span>" +
      '<span class="muted" style="font-size:14px">' + T(it.priceNote || "за штуку · цена каталога ВКонтакте на 06.11.2026") + '</span><span class="st ' + st[0] + '">' + st[1] + "</span></div>" +
      '<p class="demo">Наличие — для примера</p>' +
      '<div style="display:flex;gap:12px;flex-wrap:wrap;margin:22px 0"><a class="btn btn-main" href="index.html#lead">Рассчитать на мою площадь</a><a class="btn btn-line" href="index.html#touch">Привезти образец</a></div>' +
      '<table class="specs">' + it.specs.map(function (r) { return "<tr><td>" + T(r[0]) + "</td><td>" + T(r[1]) + "</td></tr>"; }).join("") + "</table>" +
      '<div class="two"><div><h5>Плюсы</h5><ul>' + li(it.pros) + '</ul></div><div><h5>Что потребует</h5><ul>' + li(it.needs) + "</ul></div></div>" +
      "<p><b>Подойдёт:</b> " + T(it.fits) + "</p>" +
      '<div class="need"><i class="ti ti-pencil"></i><span><b>Нужно от вас:</b> фото товара, расход на м², сроки поставки и есть ли монтаж.</span></div>' +
      '<p class="src">Источник: ' + it.source + "</p></div>";
    var more = $("#more");
    if (more) more.innerHTML = ITEMS.filter(function (x) { return x.section === it.section && x.id !== it.id; }).concat(ITEMS.filter(function (x) { return x.section !== it.section; })).slice(0, 4).map(card).join("");
  }

  /* Статья */
  var art = $("#article");
  if (art) {
    var aid = new URLSearchParams(location.search).get("id");
    var a = ARTICLES.find(function (x) { return x.id === aid; }) || ARTICLES[0];
    document.title = a.title + " — МАРТдекор";
    art.innerHTML = '<div class="crumbs"><a href="index.html">Главная</a> / <a href="index.html#tips">Советы</a></div><h1>' + T(a.title) + '</h1><p class="lead">' + T(a.lead) + '</p>' +
      '<div class="arch-ph tau"><span>фото из поста</span></div>' + a.body.map(function (p) { return "<p>" + T(p) + "</p>"; }).join("") +
      '<p class="src">По материалам салона: ' + a.source + '</p><p style="margin-top:28px"><a class="btn btn-main" href="index.html#lead">Задать вопрос менеджеру</a></p>';
  }

  /* Форма — демо */
  document.querySelectorAll("form.f").forEach(function (f) {
    f.addEventListener("submit", function (e) { e.preventDefault(); f.classList.add("sent"); });
  });

  /* Появление при прокрутке */
  function reveal() {
    var io = window.IntersectionObserver ? new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("vis"); io.unobserve(en.target); } });
    }, { threshold: .12 }) : null;
    document.querySelectorAll(".reveal:not(.vis)").forEach(function (el) { io ? io.observe(el) : el.classList.add("vis"); });
  }
  reveal();
})();
