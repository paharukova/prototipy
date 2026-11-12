(function () {
  var T = window.typo || function (s) { return s; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
  var t = function (s) { return esc(T(s)).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>"); };
  var rub = function (n) { return n.toLocaleString("ru-RU").replace(/\s/g, " ") + " ₽"; };

  function courseCard(c) {
    var cost = c.price
      ? "<b>" + rub(c.price) + "</b>" + (c.status === "check" ? '<span class="flag">уточняется</span>' : "")
      : '<b>по запросу</b><span class="flag ask">цену уточнить</span>';
    return '<a class="course reveal" data-group="' + c.group + '" href="item.html?id=' + c.id + '">' +
      '<div class="sign">' + esc(c.letter) + "</div>" +
      "<h3>" + t(c.title) + "</h3>" +
      '<div class="sub">' + t(c.sub) + "</div>" +
      '<div class="cost">' + cost + "</div></a>";
  }

  /* главная: карточки категорий */
  var home = $("#home-courses");
  if (home) {
    home.innerHTML = COURSES.filter(function (c) { return ["b", "a", "c", "ce", "c2b", "water"].indexOf(c.id) >= 0; }).map(courseCard).join("");
  }

  /* каталог: поиск и фильтры */
  var cat = $("#catalog");
  if (cat) {
    var group = new URLSearchParams(location.search).get("g") || "all";
    var q = "";
    var draw = function () {
      var list = COURSES.filter(function (c) {
        var okG = group === "all" || c.group === group;
        var hay = (c.title + " " + c.sub + " " + c.letter).toLowerCase();
        return okG && (!q || hay.indexOf(q) >= 0);
      });
      cat.innerHTML = list.map(courseCard).join("");
      $("#empty").style.display = list.length ? "none" : "block";
      document.querySelectorAll(".chip").forEach(function (b) { b.classList.toggle("on", b.dataset.g === group); });
      reveal();
    };
    document.querySelectorAll(".chip").forEach(function (b) {
      b.addEventListener("click", function () { group = b.dataset.g; draw(); });
    });
    $("#search").addEventListener("input", function (e) { q = e.target.value.trim().toLowerCase(); if (q) group = "all"; draw(); });
    draw();
  }

  /* карточка категории */
  var item = $("#item");
  if (item) {
    var id = new URLSearchParams(location.search).get("id") || "b";
    var c = COURSES.filter(function (x) { return x.id === id; })[0] || COURSES[0];
    document.title = c.title + " — автошкола «Светофор», Кемерово";
    var signColor = c.group === "re" ? "var(--yellow)" : c.group === "special" ? "var(--green)" : "var(--red)";
    var price = c.price ? rub(c.price) : "по запросу";
    item.innerHTML =
      "<div>" +
        '<a class="small" href="catalog.html">← Все категории и цены</a>' +
        '<div class="sign" style="border-color:' + signColor + ';margin-top:24px">' + esc(c.letter) + "</div>" +
        "<h1>" + t(c.title) + "</h1>" +
        '<p class="lead">' + t(c.sub) + ". " + t(c.who) + ".</p>" +
        '<h3 style="margin-top:36px">Что известно о курсе</h3>' +
        '<div class="facts-table">' + c.facts.map(function (f) { return "<div><span>" + t(f[0]) + "</span><b>" + t(f[1]) + "</b></div>"; }).join("") + "</div>" +
        (c.plus.length ? '<h3 style="margin-top:36px">Почему удобно</h3><ul class="list-check">' + c.plus.map(function (p) { return "<li>" + t(p) + "</li>"; }).join("") + "</ul>" : "") +
        (c.need ? '<div class="need" style="margin-top:24px">' + t(c.need) + "</div>" : "") +
        '<div class="photo" style="margin-top:28px;min-height:240px">Фото: учебная машина или техника для этой категории</div>' +
        '<p class="src" style="margin-top:14px">Источник: ' + t(c.src) + "</p>" +
      "</div>" +
      '<aside><div class="buy">' +
        '<span class="muted small">Стоимость обучения</span>' +
        '<div class="cost">' + price + "</div>" +
        (c.priceNote ? '<div class="need">' + t(c.priceNote) + "</div>" : "") +
        '<ul class="list-check"><li>' + t("Рассрочка без % и переплат — от автошколы или банка") + "</li><li>" + t("Начать можно в день договора") + "</li><li>" + t("Договор в любом из трёх офисов") + "</li></ul>" +
        '<a class="btn btn-green" href="index.html#signup">Записаться на обучение</a>' +
        '<a class="btn btn-line" href="' + SITE.phoneHref + '">' + SITE.phone + "</a>" +
        '<span class="small muted">' + t("Офисы работают " + HOURS.text) + "</span>" +
      "</div></aside>";
  }

  /* отзывы */
  var rv = $("#reviews");
  if (rv) {
    rv.innerHTML = REVIEWS.map(function (r) {
      return '<article class="review reveal"><span class="flag">' + t(r.tag) + "</span><p>«" + t(r.text) + "»</p>" +
        "<footer><b>" + esc(r.name) + "</b><span>" + esc(r.date) + " · " + esc(r.src) + "</span></footer></article>";
    }).join("");
  }

  /* советы */
  var ar = $("#articles");
  if (ar) {
    ar.innerHTML = ARTICLES.map(function (a) {
      return '<a class="article-card reveal" href="article.html?id=' + a.id + '"><div class="photo">Фото к статье</div><div class="txt"><span class="small muted">' + esc(a.date) + "</span><h3>" + t(a.title) + '</h3><p class="muted small">' + t(a.lead) + "</p></div></a>";
    }).join("");
  }

  /* статья */
  var art = $("#article");
  if (art) {
    var aid = new URLSearchParams(location.search).get("id");
    var a = ARTICLES.filter(function (x) { return x.id === aid; })[0] || ARTICLES[0];
    document.title = a.title + " — автошкола «Светофор»";
    art.innerHTML = '<a class="small" href="index.html#tips">← Все советы</a>' +
      '<p class="small muted" style="margin-top:24px">' + esc(a.date) + "</p>" +
      "<h1>" + t(a.title) + "</h1>" +
      '<p class="lead">' + t(a.lead) + "</p>" +
      '<div class="photo" style="min-height:300px;margin:28px 0">Фото к статье</div>' +
      a.body.map(function (p) { return "<p>" + t(p) + "</p>"; }).join("") +
      '<p class="src">Источник: ' + t(a.src) + "</p>" +
      '<div class="calm" style="margin-top:40px;padding:36px;grid-template-columns:1fr"><div><h2 style="font-size:26px">Научим ездить спокойно</h2><p class="lead">' + t("Теорию и практику можно совмещать, права — за 2–⁠3 месяца.") + '</p><a class="btn btn-green" href="index.html#signup">Записаться на обучение</a></div></div>';
  }

  /* вопросы */
  var fq = $("#faq");
  if (fq) {
    fq.innerHTML = FAQ.map(function (f, i) {
      return "<details" + (i === 0 ? " open" : "") + "><summary>" + t(f[0]) + "</summary><p>" + t(f[1]) + "</p></details>";
    }).join("");
  }

  /* филиалы и «открыто сейчас» по времени Кемерово (UTC+7) */
  var br = $("#branches");
  if (br) {
    var now = new Date(Date.now() + 7 * 3600 * 1000);
    var day = now.getUTCDay(), h = now.getUTCHours() + now.getUTCMinutes() / 60;
    var open = HOURS.days.indexOf(day) >= 0 && h >= HOURS.open && h < HOURS.close;
    var status = open ? "Открыто сейчас, до 19:00" : "Сейчас закрыто · " + HOURS.text;
    br.innerHTML = BRANCHES.map(function (b) {
      return '<div class="branch"><span class="small muted">' + esc(b.title) + (b.main ? " · главный офис" : "") + "</span><b>" + t(b.address) + '</b><a href="tel:' + b.tel + '">' + esc(b.phone) + '</a><span class="open-now' + (open ? " is-open" : "") + '">' + T(status) + "</span></div>";
    }).join("");
  }

  /* форма — в прототипе ничего не отправляет */
  document.querySelectorAll("form[data-demo]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      f.style.display = "none";
      var th = f.parentNode.querySelector(".thanks");
      if (th) th.style.display = "block";
    });
  });
  var sel = $("#course-select");
  if (sel) {
    sel.innerHTML = '<option value="">Выберите категорию</option>' + COURSES.map(function (c) { return "<option>" + esc(c.title) + "</option>"; }).join("");
  }

  /* появление при прокрутке */
  function reveal() {
    var els = document.querySelectorAll(".reveal:not(.shown)");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("shown"); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("shown"); io.unobserve(x.target); } });
    }, { threshold: .1 });
    els.forEach(function (e) { io.observe(e); });
  }
  reveal();
})();
