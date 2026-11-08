(function () {
  var T = window.typo || function (s) { return s; };
  var D = window.DIRECTIONS;
  function byId(id) { for (var i = 0; i < D.length; i++) if (D[i].id === id) return D[i]; return null; }
  function $(s) { return document.querySelector(s); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function t(s) { return esc(T(s)); }
  function tel(p) { return '<a href="tel:' + p.replace(/[^+\d]/g, "") + '">' + p + "</a>"; }
  function need(s) { return '<span class="need inline">' + t(s) + "</span>"; }
  function orgUrl(o) { return window.PROTO + o.url; }
  function link(d) { return d.page; }

  /* Знак из шести ступеней: окрашена ступень направления, у медицины — самая высокая */
  function steps(d, size) {
    var W = 102.86, H = 96, g = W * 0.0297, w = (W - 5 * g) / 6, out = "";
    for (var i = 0; i < 6; i++) {
      var h = H * (i + 1) / 6;
      out += '<rect x="' + (i * (w + g)).toFixed(2) + '" y="' + (H - h).toFixed(2) + '" width="' + w.toFixed(2) + '" height="' + h.toFixed(2) + '" rx="2.1" fill="' + (i === d.step ? d.color : "#15263A") + '"/>';
    }
    return '<svg class="steps" width="' + size + '" height="' + Math.round(size * H / W) + '" viewBox="0 0 ' + W + " " + H + '" aria-hidden="true">' + out + "</svg>";
  }

  /* Первый экран: лестница направлений (на телефоне скрыта) */
  var hs = $("#hero-stairs");
  if (hs) {
    var order = D.slice().sort(function (a, b) { return a.step - b.step; });
    hs.innerHTML = order.map(function (d) {
      var href = d.page ? link(d) : "#dir-med";
      return '<a class="hstep" href="' + href + '" style="--c:' + d.color + ";--h:" + (34 + d.step * 13) + '%"><span class="hbar"></span><span class="hlabel">' + t(d.title) + "</span></a>";
    }).join("");
  }

  /* Медицина — широкая карточка с двумя центрами */
  var med = byId("med");
  var mb = $("#dir-med");
  if (mb) {
    mb.style.setProperty("--c", med.color);
    mb.innerHTML =
      '<div class="med-head">' + steps(med, 64) + '<div><div class="group">Самое крупное направление группы</div><h3>Медицина</h3><p>' + t(med.short) + "</p></div></div>" +
      '<div class="orgs">' + med.orgs.map(function (o) {
        return '<a class="org" href="' + orgUrl(o) + '" target="_blank" rel="noopener"><div class="org-top"><b>' + t(o.name) + '</b><span class="go">Перейти на&nbsp;сайт ↗</span></div>' +
          "<p>" + t(o.what) + '</p><small>' + t(o.full) + " · " + t(o.address) + "</small></a>";
      }).join("") + "</div>";
  }

  /* Остальные направления */
  var g = $("#dir-grid");
  if (g) g.innerHTML = D.filter(function (d) { return d.page; }).map(function (d) {
    var tags = d.tags.map(function (x) { return "<li>" + t(x) + "</li>"; }).join("");
    return '<a id="dir-' + d.id + '" class="dir reveal" href="' + link(d) + '" style="--c:' + d.color + '">' +
      '<div class="top-row">' + steps(d, 44) + '<div class="dtext"><h3>' + t(d.title) + '</h3><p class="company">' + t(d.company) + "</p></div><span class=\"arrow\">→</span></div>" +
      '<p class="short">' + t(d.short) + "</p>" +
      '<ul class="tags">' + tags + "</ul>" +
      '<span class="more">Подробнее о&nbsp;направлении →</span></a>';
  }).join("") + '<a class="dir dir-help reveal" href="#zayavka"><h3>Не&nbsp;знаете, какое направление нужно?</h3><p class="short">Опишите задачу или&nbsp;приложите предписание&nbsp;— подскажем, какая компания группы её&nbsp;решит.</p><span class="more">Оставить заявку →</span></a>';

  /* По задаче */
  var tk = $("#tasks");
  if (tk) tk.innerHTML = window.TASKS.map(function (x) {
    var d = byId(x.to), href, ext = "", sub;
    if (x.org != null) { var o = d.orgs[x.org]; href = orgUrl(o); ext = ' target="_blank" rel="noopener"'; sub = d.title + " · " + o.name; }
    else { href = link(d); sub = d.title + " · " + d.company; }
    return '<a class="task reveal" href="' + href + '"' + ext + ">" + steps(d, 30) + "<span>" + t(x.q) + "<small>" + t(sub) + '</small></span><span class="arrow">→</span></a>';
  }).join("");

  /* «О группе»: расшифровка ступеней знака */
  var lg = $("#legend");
  if (lg) lg.innerHTML = D.slice().sort(function (a, b) { return b.step - a.step; }).map(function (d) {
    return '<li style="--c:' + d.color + '"><span class="n">' + (d.step + 1) + '</span><a href="' + (d.page || "#dir-med") + '">' + t(d.title) + "</a></li>";
  }).join("");

  /* Юрлица */
  var tb = $("#companies");
  if (tb) tb.innerHTML = window.COMPANIES.map(function (c) {
    return "<tr><td><b>" + t(c.name) + '</b></td><td data-l="Направление">' + t(c.dir) + '</td><td class="num" data-l="ИНН">' + c.inn + '</td><td class="num" data-l="ОГРН">' + c.ogrn + '</td><td data-l="Адрес">' + t(c.addr) + "</td></tr>";
  }).join("");

  /* Клиенты и письма */
  var cl = $("#clients");
  if (cl) cl.innerHTML = window.CLIENTS.map(function (c) { return "<div>" + t(c) + "</div>"; }).join("");
  var lt = $("#letters");
  if (lt) lt.innerHTML = window.LETTERS.map(function (c) { return '<li><span class="scan"></span><span>' + t(c) + "</span></li>"; }).join("");

  /* Контакты */
  var ct = $("#contacts");
  if (ct) {
    var rows = [];
    med.orgs.forEach(function (o) { rows.push({ c: med.color, title: "Медицина · " + o.name, company: o.full, addr: o.address, phone: o.phone }); });
    D.filter(function (d) { return d.page; }).forEach(function (d) { rows.push({ c: d.color, title: d.title, company: d.company, addr: d.address, phone: d.phone, href: d.page }); });
    ct.innerHTML = rows.map(function (r) {
      return '<div class="ccard" style="--c:' + r.c + '"><b>' + t(r.title) + "</b>" + t(r.company) + "<br>" + t(r.addr) + "<br>" +
        (r.phone ? tel(r.phone) : need("телефон для заявок")) + '<span class="person">' + need("ответственный: имя и прямой телефон") + "</span></div>";
    }).join("");
  }

  /* Версия 3: «Как работаем» */
  var hw = $("#how");
  if (hw && window.HOW) hw.innerHTML = window.HOW.map(function (s, i) {
    return '<li class="reveal"><span class="n">' + (i + 1) + "</span><b>" + t(s.t) + "</b><span class=\"d\">" + t(s.d) + "</span>" +
      (s.need ? '<span class="need inline" style="margin-top:10px">' + t(s.need) + "</span>" : "") + "</li>";
  }).join("");

  /* «Для кого»: ссылки ведут в направления (med0 / med1 — сайты двух медцентров) */
  function target(key) {
    if (key.indexOf("med") === 0) { var o = med.orgs[+key.slice(3)]; return { href: orgUrl(o), ext: true, c: med.color, sub: o.name }; }
    var d = byId(key); return { href: d.page, ext: false, c: d.color, sub: d.title };
  }
  var wh = $("#who");
  if (wh && window.WHO) wh.innerHTML = window.WHO.map(function (w) {
    return '<div class="who reveal"><h3>' + t(w.t) + "</h3><ul>" + w.items.map(function (it) {
      var x = target(it[1]);
      return '<li style="--c:' + x.c + '"><a href="' + x.href + '"' + (x.ext ? ' target="_blank" rel="noopener"' : "") + ">" + t(it[0]) + "<small>" + t(x.sub) + (x.ext ? " ↗" : " →") + "</small></a></li>";
    }).join("") + "</ul></div>";
  }).join("");

  /* Отзывы с источником */
  var rv = $("#reviews");
  if (rv && window.REVIEWS) rv.innerHTML = window.REVIEWS.map(function (r) {
    return '<figure class="review reveal"><blockquote>«' + t(r.q) + '»</blockquote><figcaption>' + t(r.who) + ' · <a href="' + r.url + '" target="_blank" rel="noopener">' + t(r.src) + " ↗</a></figcaption></figure>";
  }).join("") + '<p class="src" style="grid-column:1/-1;margin:0">Цитаты дословно. На готовом сайте подтянем свежие отзывы и рейтинг с карт.</p>';

  /* Частые вопросы */
  var fq = $("#faq");
  if (fq && window.FAQ) fq.innerHTML = window.FAQ.map(function (f) {
    return '<details class="faq-item"><summary>' + t(f.q) + "</summary>" + (f.a ? "<p>" + t(f.a) + "</p>" : '<p><span class="need inline">' + t(f.need) + "</span></p>") + "</details>";
  }).join("");

  /* Форма */
  function setupForm(form, preset) {
    if (!form) return;
    var sel = form.querySelector("select"), route = form.querySelector(".route"), done = form.querySelector(".done");
    var opts = [];
    med.orgs.forEach(function (o, i) { opts.push({ v: "med" + i, l: "Медицина — " + o.name, to: o.full }); });
    D.filter(function (d) { return d.page; }).forEach(function (d) { opts.push({ v: d.id, l: d.title, to: d.company }); });
    sel.innerHTML = '<option value="">Не знаю — помогите выбрать</option>' + opts.map(function (o) {
      return '<option value="' + o.v + '">' + esc(o.l) + "</option>";
    }).join("");
    function upd() {
      var o = null; opts.forEach(function (x) { if (x.v === sel.value) o = x; });
      route.innerHTML = o ? "Заявка уйдёт сразу в <b>" + t(o.to) + "</b>" : "Заявку получит сотрудник, который подскажет направление " + need("кто это и куда присылать");
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

  /* Страница направления */
  var page = document.body.getAttribute("data-dir");
  if (page) {
    var d = byId(page);
    document.title = d.title + " — ГК «Санэпидаудит-Кузбасс»";
    document.documentElement.style.setProperty("--c", d.color);
    $("#d-crumb").textContent = d.title;
    $("#d-logo").innerHTML = '<img src="' + d.logo + '" alt="' + esc(d.title) + ' — ГК «Санэпидаудит-Кузбасс»">';
    $("#d-title").textContent = T(d.h1 || d.title);
    $("#d-company").innerHTML = t(d.company) + (d.companyShort.charAt(0) === "«" ? "" : "<span>" + t(d.companyShort) + "</span>");
    $("#d-lead").textContent = T(d.lead);
    $("#d-tags").innerHTML = d.tags.map(function (x) { return "<li>" + t(x) + "</li>"; }).join("");
    $("#d-facts").innerHTML = d.facts ? d.facts.map(function (f) { return "<div><b>" + t(f[0]) + "</b>" + t(f[1]) + "</div>"; }).join("") : "";
    if (!d.facts) $("#d-facts").style.display = "none";

    $("#d-side").innerHTML =
      "<dl><dt>Компания</dt><dd>" + t(d.company) + "</dd>" +
      "<dt>Адрес</dt><dd>" + t(d.address) + "</dd>" +
      "<dt>Телефон</dt><dd>" + (d.phone ? tel(d.phone) : need("телефон для заявок")) + "</dd>" +
      "<dt>Режим работы</dt><dd>" + (d.hours ? t(d.hours) : need("часы работы")) + "</dd>" +
      (d.license ? "<dt>Лицензия</dt><dd>" + t(d.license) + "</dd>" : "") +
      "<dt>Ответственный</dt><dd>" + need("имя, должность и прямой телефон") + "</dd>" +
      "</dl>" + '<a class="btn btn-c" href="#zayavka" style="width:100%;margin-top:18px">Оставить заявку</a>';

    $("#d-groups").innerHTML = d.groups.map(function (gr) {
      return '<div class="sgroup reveal"><h3>' + t(gr.t) + "</h3>" + (gr.d ? '<p class="muted">' + t(gr.d) + "</p>" : "") +
        "<ul>" + gr.items.map(function (x) { return "<li>" + t(x) + "</li>"; }).join("") + "</ul>" +
        (gr.need ? '<p class="need" style="margin:12px 0 0">' + t(gr.need) + "</p>" : "") + "</div>";
    }).join("");
    $("#d-price").innerHTML = d.price ? t(d.price) : "";

    $("#d-process").innerHTML = d.process.map(function (x, i) {
      return '<li class="reveal"><span class="n">' + (i + 1) + "</span>" + t(x) + "</li>";
    }).join("");

    var docsBox = $("#d-docs-sec");
    if (d.docs) {
      $("#d-docs").innerHTML = d.docs.map(function (x) {
        return '<div class="doc reveal"><span class="scan"></span><div><b>' + t(x.t) + "</b><span>" + t(x.d) + "</span>" + (x.need ? '<br><span class="need inline">скан и номер</span>' : "") + "</div></div>";
      }).join("") + (d.docsNeed ? '<p class="need" style="grid-column:1/-1">' + t(d.docsNeed) + "</p>" : "");
    } else if (docsBox) docsBox.style.display = "none";

    var extra = $("#d-extra"), html = "";
    if (d.geo) html += '<div class="note-box"><b>География</b><p>' + t(d.geo) + "</p></div>";
    if (d.cases) html += '<div class="note-box"><b>Примеры работ группы «ЦЭИ»</b><ul>' + d.cases.map(function (c) { return "<li>" + t(c) + "</li>"; }).join("") + '</ul><p class="need" style="margin:10px 0 0">2–3 объекта в Кузбассе</p></div>';
    if (d.needList) html += '<div class="note-box"><b>Что ещё покажем на странице</b><ul>' + d.needList.map(function (c) { return "<li>" + t(c) + "</li>"; }).join("") + '</ul><p class="need" style="margin:10px 0 0">эти данные</p></div>';
    if (d.faq) html += '<div class="note-box faq"><b>Частые вопросы</b>' + d.faq.map(function (f) { return "<details><summary>" + t(f[0]) + "</summary><p>" + t(f[1]) + "</p></details>"; }).join("") + "</div>";
    if (extra) { extra.innerHTML = html; if (!html) extra.style.display = "none"; }

    $("#d-src").textContent = "Источник данных: " + d.src;
    $("#d-others").innerHTML = D.filter(function (x) { return x.id !== d.id; }).map(function (x) {
      var href = x.page ? x.page : "index.html#dir-med";
      return '<a class="task" href="' + href + '">' + steps(x, 30) + "<span>" + t(x.title) + "<small>" + t(x.page ? x.company : "АМР-Мед и Авангард-Мед") + '</small></span><span class="arrow">→</span></a>';
    }).join("");
    setupForm($("#lead-form"), d.id);
  } else setupForm($("#lead-form"), null);

  /* Год в подвале */
  var y = document.querySelectorAll(".year-now");
  for (var i = 0; i < y.length; i++) y[i].textContent = new Date().getFullYear();

  /* Появление при прокрутке */
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.05 });
    els.forEach(function (e) { io.observe(e); });
  } else els.forEach(function (e) { e.classList.add("in"); });
})();
