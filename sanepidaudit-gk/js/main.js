(function () {
  var T = window.typo || function (s) { return s; };
  var D = window.DIRECTIONS;
  var C = window.CONTACT || {};
  function byId(id) { for (var i = 0; i < D.length; i++) if (D[i].id === id) return D[i]; return null; }
  function $(s) { return document.querySelector(s); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function t(s) { return esc(T(s)); }
  function tel(p) { return '<a href="tel:' + p.replace(/[^+\d]/g, "") + '">' + p + "</a>"; }
  function need(s) { return '<span class="need inline">' + t(s) + "</span>"; }
  function orgUrl(o) { return o.url; }
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
      /* Как в знаке: ступень i высотой (i+1)/6 — одинаковый шаг, одинаковая ширина */
      var h = ((d.step + 1) / 6 * 100).toFixed(3);
      /* Узкие колонки: мягкие переносы по слогам, чтобы слова не рвались где попало */
      var SHY = { "Санитарная обработка": "Сани­тарная обра­ботка", "Проектирование и экспертизы": "Проек­тиро­вание и экс­пер­тизы", "Лаборатория": "Лабо­ра­тория", "Консалтинг и аудит": "Кон­сал­тинг и аудит", "Утилизация": "Утили­зация" };
      return '<a class="hstep" href="' + href + '" style="--c:' + d.color + ";--h:" + h + '%" aria-label="' + esc(d.title) + '"><span class="harea"><span class="hbar"></span></span><span class="hlabel" aria-hidden="true">' + esc(SHY[d.title] || d.title) + "</span></a>";
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
        return '<a class="org" href="' + orgUrl(o) + '"><div class="org-top"><b>' + t(o.name) + '</b><span class="go">Подробнее →</span></div>' +
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
    if (x.org != null) { var o = d.orgs[x.org]; href = orgUrl(o); sub = d.title + " · " + o.name; }
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
    med.orgs.forEach(function (o) { rows.push({ c: med.color, title: "Медицина · " + o.name, company: o.full, addr: o.address, phone: o.phone, href: o.url }); });
    D.filter(function (d) { return d.page; }).forEach(function (d) { rows.push({ c: d.color, title: d.title, company: d.company, addr: d.address, phone: d.phone, href: d.page }); });
    ct.innerHTML = rows.map(function (r) {
      return '<div class="ccard" style="--c:' + r.c + '"><b><a href="' + r.href + '">' + t(r.title) + " →</a></b>" + t(r.company) + "<br>" + t(r.addr) + "<br>" +
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
    if (key.indexOf("med") === 0) { var o = med.orgs[+key.slice(3)]; return { href: orgUrl(o), ext: false, c: med.color, sub: o.name }; }
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
      done.textContent = T("Это прототип — заявка никуда не отправлена. На готовом сайте она придёт в выбранную компанию, а в отчёте рекламы будет видно, откуда пришёл клиент: " + utmText() + ".");
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
      '<form class="quick-form side-form"><b class="qf-title">' + t(d.cta || "Рассчитаем стоимость") + '</b>' +
      '<p class="qf-sub">' + t("Оставьте телефон — перезвоним за " + (C.answer || "15 минут") + " в рабочее время") + '</p>' +
      '<input type="text" name="name" placeholder="Имя" autocomplete="name" aria-label="Имя">' +
      '<input type="tel" name="phone" placeholder="+7 ___ ___-__-__" autocomplete="tel" aria-label="Телефон" required>' +
      '<input type="hidden" name="direction" value="' + d.id + '">' +
      '<button class="btn btn-c" type="submit">Перезвоните мне</button>' +
      '<p class="qf-or">или напишите в мессенджер</p><div class="msgr" data-msgr></div>' +
      '<p class="qf-policy">Нажимая кнопку, вы соглашаетесь с <a href="#">политикой обработки данных</a></p><div class="done"></div></form>' +
      '<dl class="side-dl"><dt>Компания</dt><dd>' + t(d.company) + "</dd>" +
      "<dt>Адрес</dt><dd>" + t(d.address) + "</dd>" +
      "<dt>Телефон</dt><dd>" + (d.phone ? tel(d.phone) : need("телефон для заявок")) + "</dd>" +
      "<dt>Режим работы</dt><dd>" + (d.hours ? t(d.hours) : need("часы работы")) + "</dd>" +
      (d.license ? "<dt>Лицензия</dt><dd>" + t(d.license) + "</dd>" : "") +
      "<dt>Ответственный</dt><dd>" + need("имя, должность и прямой телефон") + "</dd>" +
      "</dl>";

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
    var others = [];
    D.filter(function (x) { return x.id !== d.id; }).forEach(function (x) {
      if (x.page) others.push({ d: x, href: x.page, title: x.title, sub: x.company });
      else x.orgs.forEach(function (o) { others.push({ d: x, href: o.url, title: x.title + ": " + o.name, sub: o.what.split(",")[0] }); });
    });
    $("#d-others").innerHTML = others.map(function (x) {
      return '<a class="task" href="' + x.href + '">' + steps(x.d, 30) + "<span>" + t(x.title) + "<small>" + t(x.sub) + '</small></span><span class="arrow">→</span></a>';
    }).join("");
    var cta = document.querySelectorAll("[data-d-cta]");
    for (var ci = 0; ci < cta.length; ci++) cta[ci].textContent = T(d.cta || "Рассчитаем стоимость и сроки");
    setupForm($("#lead-form"), d.id);
  } else setupForm($("#lead-form"), null);

  /* ===== Версия 4: заявки ===== */

  /* Метки рекламы (utm_source, utm_campaign…): запоминаем при первом заходе,
     чтобы в заявке было видно, с какой рекламы пришёл клиент */
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
  document.querySelectorAll("form").forEach(function (f) {
    UTM_KEYS.forEach(function (k) {
      var i = document.createElement("input"); i.type = "hidden"; i.name = k; i.value = utm[k] || ""; f.appendChild(i);
    });
    var pg = document.createElement("input"); pg.type = "hidden"; pg.name = "page"; pg.value = document.title; f.appendChild(pg);
  });

  /* Мессенджеры и телефон. Пока номеров нет — кнопка показывает подсказку */
  var MSG = [
    { k: "whatsapp", l: "WhatsApp", href: function (v) { return "https://wa.me/" + v.replace(/\D/g, ""); } },
    { k: "telegram", l: "Telegram", href: function (v) { return "https://t.me/" + v.replace(/^@/, ""); } },
    { k: "max", l: "MAX", href: function (v) { return v; } }
  ];
  var ICON = {
    whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>',
    telegram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.4 3.6 2.9 10.7c-1.3.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.4l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.3-.5-1.9-1.4-1.5ZM9.8 14.6l-.4 3.6-1.3-4.3 9.6-6.1-7.9 6.8Z"/></svg>',
    max: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.9 14.6L2 22l5.6-1.1A10 10 0 1 0 12 2Zm4.6 13.6h-1.9V10l-2.7 3.9L9.3 10v5.6H7.4V7.2h1.8l2.8 4.1 2.8-4.1h1.8v8.4Z"/></svg>'
  };
  function msgrHtml() {
    return MSG.map(function (m) {
      var v = C[m.k];
      return '<a class="mbtn mbtn-' + m.k + '" href="' + (v ? m.href(v) : "#") + '"' + (v ? ' target="_blank" rel="noopener"' : ' data-need="' + m.l + '"') + ">" + ICON[m.k] + "<span>" + m.l + "</span></a>";
    }).join("");
  }
  document.querySelectorAll("[data-msgr]").forEach(function (el) { el.innerHTML = msgrHtml(); });
  var phoneHref = C.phone ? "tel:" + C.phone.replace(/[^+\d]/g, "") : "#zayavka";
  document.querySelectorAll("[data-phone]").forEach(function (el) { el.href = phoneHref; var s = el.querySelector("span"); (s || el).textContent = C.phone || "Телефон"; });
  document.querySelectorAll("[data-answer]").forEach(function (el) { el.textContent = C.answer || ""; });

  /* Подсказка вместо пустых ссылок в прототипе */
  var toast = document.createElement("div"); toast.className = "toast"; toast.setAttribute("role", "status"); document.body.appendChild(toast);
  var tt;
  function showToast(msg) { toast.textContent = T(msg); toast.classList.add("on"); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove("on"); }, 3200); }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-need]");
    if (!a) return;
    e.preventDefault();
    showToast("Прототип: здесь будет ваш " + a.getAttribute("data-need") + ", пришлите номер — подключим");
  });

  /* Нижняя панель на телефоне: позвонить, написать, заявка */
  var mbar = document.createElement("div");
  mbar.className = "mbar";
  mbar.innerHTML =
    '<a href="' + phoneHref + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2Z"/></svg>Позвонить</a>' +
    '<button type="button" class="mbar-msg" aria-expanded="false">' + ICON.whatsapp + "Написать</button>" +
    '<a class="mbar-main" href="#zayavka">Оставить заявку</a>' +
    '<div class="mbar-pop msgr" hidden>' + msgrHtml() + "</div>";
  document.body.appendChild(mbar);
  document.body.classList.add("has-mbar");
  var mb2 = mbar.querySelector(".mbar-msg"), pop = mbar.querySelector(".mbar-pop");
  mb2.addEventListener("click", function () { var o = pop.hidden; pop.hidden = !o; mb2.setAttribute("aria-expanded", o ? "true" : "false"); });

  /* Короткие формы «Перезвоните мне» */
  document.querySelectorAll(".quick-form").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var done = f.querySelector(".done");
      done.style.display = "block";
      done.textContent = T("Спасибо! Это прототип — заявка никуда не ушла. На готовом сайте перезвоним за " + (C.answer || "15 минут") + ". Источник: " + utmText() + ".");
    });
  });

  /* Способ связи в большой форме */
  document.querySelectorAll(".way").forEach(function (w) {
    w.addEventListener("change", function () {
      var v = (w.querySelector("input:checked") || {}).value, tel = w.closest("form").querySelector('input[type="tel"]');
      if (tel) tel.placeholder = v === "telegram" ? "Телефон или ник в Telegram" : "+7 ___ ___-__-__";
    });
  });

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
