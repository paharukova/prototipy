(function () {
  var T = window.typo || function (s) { return s; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var secName = function (id) { var s = SECTIONS.find(function (x) { return x.id === id; }); return s ? s.name : ""; };
  var ST = { in: ["in", "В шоуруме"], few: ["few", "Осталось мало"] };
  var COLORS = { "Бежевый": "#CDB59A", "Шоколадный": "#5A3B2B", "Графит": "#4A4A4C", "Серый": "#A7A5A1" };
  var WA = "79059161851";
  var TG = "https://t.me/+Z2Is1JQq2DJkNmUy";
  var wa = function (text) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(text); };

  /* Логотип: капля молока со строчкой */
  var LOGO = '<svg viewBox="0 0 26 34" aria-hidden="true"><path d="M13 1.5C13 1.5 2 14.5 2 21.5a11 11 0 0 0 22 0C24 14.5 13 1.5 13 1.5z" fill="#EFE7DB" stroke="#3B2A21" stroke-width="1.8"/><path d="M13 7.5C9 13 6.5 17.6 6.5 21.4a6.5 6.5 0 0 0 6.5 6.5" fill="none" stroke="#8C6249" stroke-width="1.6" stroke-dasharray="2.4 2.4" stroke-linecap="round"/></svg>';
  var logo = '<a class="logo" href="index.html">' + LOGO + '<span><b>moloko mood</b><small>своё производство</small></span></a>';

  /* Шапка и подвал — одни на все страницы */
  var page = document.body.dataset.page;
  var link = function (href, text, key) { return '<a href="' + href + '"' + (page === key ? ' class="on"' : "") + ">" + text + "</a>"; };
  var head = document.getElementById("site-head");
  if (head) head.innerHTML =
    '<div class="top"><div class="wrap"><span class="open-now" id="open-now"><i></i><span>Ежедневно 11:00–20:00</span></span>' +
    "<span>Кемерово, Ленинградский проспект, 44 · левое крыло здания</span></div></div>" +
    '<header class="site"><div class="wrap">' + logo +
    '<nav class="main">' + link("catalog.html", "Каталог", "catalog") + link("index.html#fit", "Как сядет one size", "") + link("index.html#days", "Дни клиента", "") + link("index.html#reviews", "Отзывы", "") + link("index.html#visit", "Шоурум", "") + "</nav>" +
    '<div class="head-cta"><a class="phone" href="tel:+79059161851">+7 905 916‑18‑51</a><a class="btn btn-main" href="' + wa("Здравствуйте! Хочу подобрать образ.") + '" target="_blank" rel="noopener"><i class="ti ti-brand-whatsapp"></i>Написать</a></div></div></header>';

  var foot = document.getElementById("site-foot");
  if (foot) {
    foot.className = "site";
    foot.innerHTML = T(
      '<div class="wrap"><div>' + logo +
      '<p style="margin-top:18px;max-width:320px">Одежда собственного пошива и шоурум в Кемерово. Женская, мужская и унисекс. Доставка по России.</p></div>' +
      "<div><h5>Каталог</h5>" + SECTIONS.map(function (s) { return '<a href="catalog.html?s=' + s.id + '">' + s.name + "</a>"; }).join("") + '<a href="index.html#fit">Как сядет one size</a></div>' +
      '<div><h5>Покупателям</h5><a href="index.html#days">Дни клиента</a><a href="index.html#faq">Доставка и оплата</a><a href="index.html#reviews">Отзывы</a><a href="index.html#visit">Как добраться</a></div>' +
      '<div><h5>Контакты</h5><a href="tel:+79059161851">+7 905 916‑18‑51</a><a href="tel:+79059050475">+7 905 905‑04‑75</a><a href="' + wa("Здравствуйте!") + '" target="_blank" rel="noopener">WhatsApp</a><a href="' + TG + '" target="_blank" rel="noopener">Telegram-канал</a></div>' +
      "<div class=\"bottom\"><span>Прототип сайта · данные из 2ГИС и Яндекс Карт, ноябрь 2026 · модели, цвета и наличие показаны для примера</span><span>Прототип подготовила Татьяна</span></div></div>");
  }

  /* Открыто сейчас — по времени Кемерово (UTC+7) */
  var on = document.getElementById("open-now");
  if (on) {
    var now = new Date(Date.now() + (new Date().getTimezoneOffset() + 420) * 60000);
    var m = now.getHours() * 60 + now.getMinutes();
    var isOpen = m >= 660 && m < 1200;
    on.classList.toggle("is-open", isOpen);
    on.querySelector("span").textContent = isOpen ? "Шоурум открыт до 20:00" : "Сейчас закрыто · откроемся в 11:00";
  }

  /* Карточка вещи в сетке */
  function card(it) {
    var st = ST[it.status];
    var who = WHO[it.who] ? " · " + WHO[it.who].toLowerCase() : "";
    return '<a class="card reveal" href="item.html?id=' + it.id + '">' +
      '<div class="ph ' + it.tone + '"><span class="size-tag">ONE SIZE</span><span>фото модели</span></div>' +
      '<div class="body"><div class="sec">' + T(secName(it.section)) + who + "</div><h4>" + T(it.name) + '</h4><div class="short">' + T(it.short) + "</div>" +
      '<div class="bottom"><span class="price-ask">Цена уточняется</span><span class="st ' + st[0] + '">' + st[1] + "</span></div></div></a>";
  }

  /* Главная */
  var cats = $("#cats");
  if (cats) cats.innerHTML = SECTIONS.map(function (s, i) {
    return '<a class="cat reveal" href="catalog.html?s=' + s.id + '"><div class="ph ' + ["latte", "sand", "milk"][i] + '"><span>фото раздела</span></div>' +
      '<div class="t"><h3>' + T(s.name) + "</h3><p>" + T(s.fact) + '</p><span class="go">Смотреть →</span></div></a>';
  }).join("");
  var pop = $("#popular");
  if (pop) pop.innerHTML = ["suit-zip", "men-suit", "suit-2", "down"].map(function (id) {
    return card(ITEMS.find(function (x) { return x.id === id; }));
  }).join("");
  var revs = $("#reviews-list");
  if (revs) revs.innerHTML = REVIEWS.map(function (r) {
    return '<div class="rev reveal"><div class="stars">★★★★★</div><p>«' + T(r.text) + '»</p><b>' + r.name + "</b><small>" + r.date + " · отзыв в 2ГИС</small></div>";
  }).join("");
  var faq = $("#faq-list");
  if (faq) faq.innerHTML = FAQ.map(function (q) {
    return "<details><summary>" + T(q[0]) + "</summary><p>" + T(q[1]) + "</p>" +
      (q[3] ? '<div class="need" style="margin:10px 0"><i class="ti ti-pencil"></i><span><b>Нужно от вас:</b> подробности для этого ответа.</span></div>' : "") +
      "<small>Источник: " + q[2] + "</small></details>";
  }).join("");

  /* Каталог */
  var grid = $("#catalog-grid");
  if (grid) {
    var params = new URLSearchParams(location.search);
    var state = { s: params.get("s") || "all", q: "", color: [], st: [], who: params.get("for") ? [params.get("for")] : [] };
    var tabs = $("#tabs");
    tabs.innerHTML = '<button data-s="all">Все</button>' + SECTIONS.map(function (s) { return '<button data-s="' + s.id + '">' + T(s.name) + "</button>"; }).join("");
    $("#f-who").innerHTML = Object.keys(WHO).map(function (k) {
      return '<label><input type="checkbox" value="' + k + '"' + (state.who.indexOf(k) >= 0 ? " checked" : "") + "> " + WHO[k] + "</label>";
    }).join("");
    $("#f-color").innerHTML = Object.keys(COLORS).map(function (c) {
      return '<label><input type="checkbox" value="' + c + '"> <span class="chip" style="background:' + COLORS[c] + '"></span> ' + c + "</label>";
    }).join("");
    var draw = function () {
      tabs.querySelectorAll("button").forEach(function (b) { b.classList.toggle("on", b.dataset.s === state.s); });
      var list = ITEMS.filter(function (i) {
        return (state.s === "all" || i.section === state.s) &&
          (!state.q || (i.name + " " + i.short + " " + i.color).toLowerCase().indexOf(state.q) >= 0) &&
          (!state.color.length || state.color.indexOf(i.color) >= 0) &&
          (!state.st.length || state.st.indexOf(i.status) >= 0) &&
          (!state.who.length || state.who.indexOf(i.who) >= 0 || (i.who === "unisex" && (state.who.indexOf("men") >= 0 || state.who.indexOf("women") >= 0)));
      });
      $("#count").textContent = "Показано вещей: " + list.length + " · в прототипе — выборка, на сайте будет весь ассортимент";
      grid.innerHTML = list.length ? list.map(card).join("") : '<div class="empty">Ничего не нашлось. Сбросьте фильтры или <a href="' + wa("Здравствуйте! Помогите подобрать вещь.") + '" target="_blank" rel="noopener">напишите нам</a> — подберём.</div>';
      reveal();
    };
    var checked = function (sel) { return Array.from(document.querySelectorAll(sel + " input:checked")).map(function (x) { return x.value; }); };
    tabs.addEventListener("click", function (e) { if (e.target.dataset.s) { state.s = e.target.dataset.s; draw(); } });
    $("#q").addEventListener("input", function (e) { state.q = e.target.value.trim().toLowerCase(); draw(); });
    $("#f-color").addEventListener("change", function () { state.color = checked("#f-color"); draw(); });
    $("#f-st").addEventListener("change", function () { state.st = checked("#f-st"); draw(); });
    $("#f-who").addEventListener("change", function () { state.who = checked("#f-who"); draw(); });
    draw();
  }

  /* Карточка вещи */
  var itemBox = $("#item");
  if (itemBox) {
    var id = new URLSearchParams(location.search).get("id");
    var it = ITEMS.find(function (x) { return x.id === id; }) || ITEMS[0];
    var st = ST[it.status];
    document.title = it.name + " — Moloko Mood";
    itemBox.innerHTML =
      '<div class="gal"><div class="ph big ' + it.tone + '"><span>фото модели в полный рост</span></div><div class="thumbs">' +
      ["ткань вблизи", "со спины", "в движении", "детали"].map(function (t, i) { return '<div class="ph ' + ["milk", "sand", "latte", "milk"][i] + '"><span>' + t + "</span></div>"; }).join("") + "</div></div>" +
      '<div><div class="crumbs"><a href="index.html">Главная</a> / <a href="catalog.html?s=' + it.section + '">' + T(secName(it.section)) + "</a></div>" +
      "<h1>" + T(it.name) + '</h1><p class="muted">' + T(it.short) + "</p>" +
      '<div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap"><span class="price-ask" style="font-size:16px;padding:7px 16px">Цена уточняется</span><span class="st ' + st[0] + '">' + st[1] + '</span></div>' +
      '<div class="opts"><div><h5>Цвет</h5><div class="row"><span><i class="chip" style="background:' + COLORS[it.color] + ';vertical-align:-2px;margin-right:6px"></i>' + it.color + '</span></div></div>' +
      '<div><h5>Размер</h5><div class="row"><span>ONE SIZE</span></div></div>' + (WHO[it.who] ? '<div><h5>Для кого</h5><div class="row"><span>' + WHO[it.who] + "</span></div></div>" : "") + "</div>" +
      '<div class="need"><i class="ti ti-ruler-measure"></i><span><b>Нужно от вас:</b> на какой рост и обхваты рассчитана модель, рост модели на фото. Это главный вопрос в отзывах про one size.</span></div>' +
      '<div class="item-actions"><a class="btn btn-wa" href="' + wa("Здравствуйте! Хочу заказать: " + it.name + " (" + it.color.toLowerCase() + "). Подскажите цену и как сядет на мой рост.") + '" target="_blank" rel="noopener"><i class="ti ti-brand-whatsapp"></i>Заказать в WhatsApp</a>' +
      '<button class="btn btn-line" id="try-btn" type="button"><i class="ti ti-hanger"></i>Отложить на примерку</button></div>' +
      '<div class="try" id="try"><b>Отложим вещь в шоуруме</b><form><div class="fields"><input required placeholder="Ваше имя"><input required type="tel" placeholder="Телефон"><select><option>Сегодня</option><option>Завтра</option><option>В выходные</option></select><input placeholder="Ваш рост, см"></div><button class="btn btn-main" type="submit">Отложить</button></form>' +
      '<p class="ok">Готово! Мы напишем вам в WhatsApp, когда вещь будет ждать в шоуруме.</p><p class="demo" style="margin:8px 0 0">В прототипе форма ничего не отправляет</p></div>' +
      '<div class="about"><h5 style="font:500 13px var(--display);letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin:0 0 8px">О модели</h5><p>' + T(it.about) + "</p></div>" +
      '<p class="demo">Название, цвет и наличие — для примера</p>' +
      '<p class="src">Источник: ' + it.source + "</p></div>";
    var tb = $("#try-btn"), tr = $("#try");
    tb.addEventListener("click", function () { tr.classList.toggle("open"); });
    tr.querySelector("form").addEventListener("submit", function (e) { e.preventDefault(); tr.classList.add("sent"); });
    var more = $("#more");
    if (more) more.innerHTML = ITEMS.filter(function (x) { return x.id !== it.id; }).slice(0, 4).map(card).join("");
  }

  /* Появление при прокрутке */
  function reveal() {
    var io = window.IntersectionObserver ? new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("vis"); io.unobserve(en.target); } });
    }, { threshold: .12 }) : null;
    document.querySelectorAll(".reveal:not(.vis)").forEach(function (el) { io ? io.observe(el) : el.classList.add("vis"); });
  }
  reveal();
})();
