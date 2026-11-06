(function () {
  var T = window.typo || function (s) { return s; };
  var D = window.DIRECTIONS;
  function byId(id) { for (var i = 0; i < D.length; i++) if (D[i].id === id) return D[i]; return null; }
  function $(s) { return document.querySelector(s); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function t(s) { return esc(T(s)); }

  /* Значок «ступени» — как в логотипе: цветная ступень = направление.
     Для лаборатории — шестая ступень (предложение). */
  function steps(d, size) {
    var n = d.step === 5 ? 6 : 5, w = 17.83, gap = 3.43, H = 96, out = "";
    var hs = n === 6 ? [16, 32, 48, 64, 80, 96] : window.STEP_H;
    for (var i = 0; i < n; i++) {
      var h = hs[i];
      out += '<rect x="' + (i * (w + gap)).toFixed(2) + '" y="' + (H - h).toFixed(2) + '" width="' + w + '" height="' + h.toFixed(2) + '" rx="2.57" fill="' + (i === d.step ? d.color : "#15263A") + '"/>';
    }
    var W = n * w + (n - 1) * gap;
    return '<svg class="steps" width="' + size + '" height="' + size + '" viewBox="0 0 ' + W.toFixed(2) + ' 96" aria-hidden="true">' + out + "</svg>";
  }
  window.stepsIcon = steps;

  function link(d) { return "napravlenie.html?id=" + d.id; }

  /* Первый экран: список направлений */
  var hp = $("#hero-dirs");
  if (hp) hp.innerHTML = D.map(function (d) {
    return '<a class="row" href="#dir-' + d.id + '">' + steps(d, 34) +
      "<div><b>" + t(d.title) + "</b><span>" + t(d.company) + "</span></div><span class=\"go\">→</span></a>";
  }).join("");

  /* Карточки направлений */
  var g = $("#dir-grid");
  if (g) g.innerHTML = D.map(function (d) {
    var tags = d.tags.map(function (x) { return "<li>" + t(x) + "</li>"; }).join("");
    var facts = d.facts.map(function (x) { return "<li>" + t(x) + "</li>"; }).join("");
    var act = d.site
      ? '<a class="btn btn-c btn-sm" href="' + d.site + '" target="_blank" rel="noopener">Перейти на сайт ↗</a><span class="site">' + d.siteName + "</span>"
      : '<a class="btn btn-c btn-sm" href="' + link(d) + '">Подробнее о направлении</a>';
    return '<article id="dir-' + d.id + '" class="dir reveal' + (d.big ? " big" : "") + '" style="--c:' + d.color + '">' +
      '<div class="top-row"><div><div class="group">' + t(d.group) + "</div><h3>" + t(d.title) + '</h3><p class="company">' + t(d.company) + "</p></div>" + steps(d, d.big ? 56 : 44) + "</div>" +
      (d.variant ? '<div><span class="badge-variant">Вариант для обсуждения: лаборатория — отдельным направлением</span></div>' : "") +
      '<p class="short">' + t(d.short) + "</p>" +
      '<ul class="tags">' + tags + "</ul>" +
      (d.needTags ? '<p class="need" style="margin:0 0 14px">' + t("полный перечень услуг и цены «от»") + "</p>" : "") +
      '<ul class="facts">' + facts + "</ul>" +
      '<div class="actions">' + act + "</div></article>";
  }).join("");

  /* По задаче */
  var tk = $("#tasks");
  if (tk) tk.innerHTML = window.TASKS.map(function (x) {
    var d = byId(x.to);
    return '<a class="task reveal" href="' + (d.site ? d.site : link(d)) + '"' + (d.site ? ' target="_blank" rel="noopener"' : "") + ">" + steps(d, 30) +
      "<span>" + t(x.q) + "<small>" + t(d.title) + " · " + t(d.company) + "</small></span><span class=\"arrow\">→</span></a>";
  }).join("");

  /* Лестница истории */
  var ld = $("#ladder");
  if (ld) ld.innerHTML = window.HISTORY.map(function (h, i) {
    return '<a href="' + link(byId(h.id)) + '"><div class="stair" style="height:' + (200 + i * 40) + 'px">' +
      '<div class="year">' + h.year + '</div><div class="d">' + t(h.dir) + '</div><div class="t">' + t(h.text) + "</div></div></a>";
  }).join("");

  /* Юрлица */
  var tb = $("#companies");
  if (tb) tb.innerHTML = window.COMPANIES.map(function (c) {
    var miss = '<span class="need inline">уточнить</span>';
    return "<tr><td><b>" + t(c.name) + '</b></td><td data-l="Направление">' + t(c.dir) + '</td><td class="num" data-l="ИНН">' + (c.inn || miss) + '</td><td class="num" data-l="ОГРН">' + (c.ogrn || miss) + '</td><td data-l="Адрес">' + t(c.addr) + "</td></tr>";
  }).join("");

  /* Клиенты и письма */
  var cl = $("#clients");
  if (cl) cl.innerHTML = window.CLIENTS.map(function (c) { return "<div>" + t(c) + "</div>"; }).join("");
  var lt = $("#letters");
  if (lt) lt.innerHTML = window.LETTERS.map(function (c) { return '<li><span class="scan"></span><span>' + t(c) + "</span></li>"; }).join("");

  /* Контакты по направлениям */
  var ct = $("#contacts");
  if (ct) ct.innerHTML = D.map(function (d) {
    return '<div class="ccard" style="--c:' + d.color + '"><b>' + t(d.title) + "</b>" + t(d.company) + "<br>" + t(d.address) + "<br>" +
      (d.phone ? '<a href="tel:' + d.phone.replace(/[^+\d]/g, "") + '">' + d.phone + "</a>" : '<span class="need inline">телефон и почта для заявок</span>') + "</div>";
  }).join("");

  /* Форма: выбор направления и куда уйдёт заявка */
  function setupForm(form, preset) {
    if (!form) return;
    var sel = form.querySelector("select"), route = form.querySelector(".route"), done = form.querySelector(".done");
    sel.innerHTML = '<option value="">Не знаю — помогите выбрать</option>' + D.map(function (d) {
      return '<option value="' + d.id + '">' + esc(d.title) + "</option>";
    }).join("");
    function upd() {
      var d = byId(sel.value);
      route.innerHTML = d ? "Заявка уйдёт сразу в <b>" + t(d.company) + "</b>" : "Заявку получит ответственный за подбор направления <span class=\"need inline\">кто это</span>";
    }
    sel.addEventListener("change", upd);
    if (preset) sel.value = preset;
    upd();
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      done.style.display = "block";
      done.textContent = T("Это прототип — заявка никуда не отправлена. На готовом сайте она придёт в выбранную компанию.");
    });
  }
  if (!$("#dir-page")) setupForm($("#lead-form"), null);

  /* Страница направления */
  var page = $("#dir-page");
  if (page) {
    var id = new URLSearchParams(location.search).get("id") || "lab";
    var d = byId(id) || byId("lab");
    document.title = d.title + " — ГК «Санэпидаудит-Кузбасс»";
    document.documentElement.style.setProperty("--c", d.color);
    $("#d-crumb").textContent = d.title;
    $("#d-group").textContent = d.group;
    $("#d-title").textContent = T(d.title);
    $("#d-company").textContent = T(d.company);
    $("#d-about").textContent = T(d.about);
    $("#d-icon").innerHTML = steps(d, 72);
    $("#d-variant").style.display = d.variant ? "block" : "none";
    $("#d-tags").innerHTML = d.tags.map(function (x) { return "<li>" + t(x) + "</li>"; }).join("");
    $("#d-svc").innerHTML = d.services
      ? d.services.map(function (x) { return "<li>" + t(x) + "</li>"; }).join("")
      : '<li class="need" style="grid-column:1/-1;border-left:2px dashed var(--amber-light)">перечень услуг этого направления, сроки и что клиент получает на руки</li>';
    $("#d-side").innerHTML =
      "<dl><dt>Компания</dt><dd>" + t(d.company) + "</dd>" +
      "<dt>Адрес</dt><dd>" + t(d.address) + "</dd>" +
      "<dt>Телефон</dt><dd>" + (d.phone ? '<a href="tel:' + d.phone.replace(/[^+\d]/g, "") + '">' + d.phone + "</a>" : '<span class="need inline">телефон для заявок</span>') + "</dd>" +
      "<dt>Лицензия, аккредитация</dt><dd>" + (d.license ? t(d.license) : '<span class="need inline">номер и скан</span>') + "</dd></dl>" +
      (d.site ? '<p style="margin:18px 0 0"><a class="btn btn-c" href="' + d.site + '" target="_blank" rel="noopener">Полный сайт: ' + d.siteName + " ↗</a></p>"
        : '<p class="src" style="margin:18px 0 0">' + T("Своего сайта у компании пока нет — эта страница его заменяет. Когда сайт появится, здесь будет ссылка.") + "</p>");
    $("#d-src").textContent = "Источник данных: " + d.src;
    $("#d-others").innerHTML = D.filter(function (x) { return x.id !== d.id; }).map(function (x) {
      return '<a class="task" href="' + (x.site ? x.site : link(x)) + '"' + (x.site ? ' target="_blank" rel="noopener"' : "") + ">" + steps(x, 30) + "<span>" + t(x.title) + "<small>" + t(x.company) + "</small></span><span class=\"arrow\">→</span></a>";
    }).join("");
    setupForm($("#lead-form"), d.id);
  }

  /* Год в подвале — автоматически */
  var y = document.querySelectorAll(".year-now");
  for (var i = 0; i < y.length; i++) y[i].textContent = new Date().getFullYear();

  /* Появление при прокрутке */
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  } else els.forEach(function (e) { e.classList.add("in"); });
})();
