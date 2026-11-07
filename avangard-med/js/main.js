(function () {
  var S = window.SITE, T = window.typo;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var t = function (s) { return esc(T(s || "")); };
  var page = document.body.dataset.page;

  /* «открыто сейчас»: регистратура пн–пт 8–17, врачи 8–12, обед 12–13 */
  function status() {
    var d = new Date(), day = d.getDay(), m = d.getHours() * 60 + d.getMinutes();
    if (day === 0 || day === 6) return { on: false, text: "Сегодня выходной, ждём в понедельник с 8:00" };
    if (m < 480) return { on: false, text: "Откроемся сегодня в 8:00" };
    if (m < 720) return { on: true, text: "Открыто, врачи принимают до 12:00" };
    if (m < 780) return { on: false, text: "Обед до 13:00" };
    if (m < 1020) return { on: true, text: "Регистратура открыта до 17:00, врачи — завтра с 8:00" };
    return { on: false, text: "Закрыто, откроемся завтра в 8:00" };
  }

  /* шапка и подвал — одни на все страницы */
  var MARK = function (w, light) { return '<svg class="gk-mark" width="' + w + '" height="' + Math.round(w * 96 / 102.86) + '" viewBox="0 0 102.86 96" aria-hidden="true">' + '<rect x="0.00" y="80.00" width="14.60" height="16.00" rx="2.1" fill="#15263A"/><rect x="17.65" y="64.00" width="14.60" height="32.00" rx="2.1" fill="#15263A"/><rect x="35.30" y="48.00" width="14.60" height="48.00" rx="2.1" fill="#15263A"/><rect x="52.96" y="32.00" width="14.60" height="64.00" rx="2.1" fill="#15263A"/><rect x="70.61" y="16.00" width="14.60" height="80.00" rx="2.1" fill="#15263A"/><rect x="88.26" y="0.00" width="14.60" height="96.00" rx="2.1" fill="#1F6FD1"/>'.replace(/#15263A/g, light ? "#FFFFFF" : "#15263A") + "</svg>"; };
  var nav = [["catalog.html", "Справки и осмотры"], ["article.html?id=prava-za-utro", "Как пройти за утро"], ["index.html#org", "Организациям"], ["index.html#where", "Как добраться"]];
  var st = status();
  var head = $("#top");
  if (head) head.innerHTML =
    '<div class="wrap">' +
    '<a class="logo-box" href="index.html">' + MARK(36) + '<span class="logo-txt"><span class="logo"><span class="a">Авангард</span>-<span class="m">Мед</span></span><small>Медосмотры и справки в Кемерово</small></span></a>' +
    '<nav class="nav">' + nav.map(function (n) { return '<a href="' + n[0] + '"' + (location.pathname.indexOf(n[0].split("?")[0].split("#")[0]) >= 0 && n[0].indexOf("#") < 0 ? ' class="on"' : "") + ">" + t(n[1]) + "</a>"; }).join("") + "</nav>" +
    '<div class="top-right"><span class="open-now"><i class="dot' + (st.on ? " on" : "") + '"></i>' + t(st.on ? "Открыто" : "Закрыто") + "</span>" +
    '<a class="tel" href="' + S.phoneHref + '">' + S.phone.replace(/ /g, " ") + "</a>" +
    '<a class="btn btn-main btn-sm" href="index.html#zayavka">Задать вопрос</a></div></div>';

  var foot = $("#foot");
  if (foot) foot.innerHTML =
    '<div class="wrap"><div class="foot">' +
    "<div><b>ООО МПЦ «Авангард-Мед»</b><br>" + t("ОГРН 1154205017010, ИНН 4205318095") + "<br>" + t("Лицензия Л041-01161-42/00324463, Минздрав Кузбасса") + "<br>" + t("Не работаем по программе госгарантий (ОМС)") + '<br><a class="gk-link" href="https://paharukova.github.io/prototipy/sanepidaudit-gk/" target="_blank" rel="noopener">' + MARK(22, true) + 'ГК «Санэпидаудит-Кузбасс»</a></div>' +
    "<div><b>" + t(S.address) + "</b><br>" + t(S.addressNote) + "<br>" + t("Регистратура: пн–пт 8:00–17:00") + "<br>" + t("Врачи: пн–пт 8:00–12:00") + "</div>" +
    '<div><a href="' + S.phoneHref + '">' + esc(S.phone) + "</a>, " + esc(S.phoneExt) + "<br>" + '<a href="mailto:' + S.email + '">' + S.email + "</a><br>" + '<a href="svedeniya.html">' + t("Сведения о медицинской организации") + "</a><br>" + t("Политика обработки персональных данных") + "</div>" +
    "</div>" +
    '<div class="proto">' + t("Прототип сайта, версия 2: единый стиль с сайтом группы, ответы из брифа, сведения о медорганизации по закону. Цены — с сайта amed42.ru и из брифа, отзывы — из 2ГИС, маршруты собраны по отзывам пациентов и требуют проверки. Фото — заглушки. Подготовила Татьяна, ноябрь 2026.") + "</div></div>";

  /* карточки услуг */
  function svcCard(s, hot) {
    var price = s.price ? '<div class="price">' + t(s.price) + "</div>" : '<div class="price none">' + t("Нужно от вас: цена") + "</div>";
    return '<a class="svc rv' + (hot ? " hot" : "") + '" href="item.html?id=' + s.id + '">' +
      (hot ? '<span class="hot-tag">' + t("Чаще всего ищут") + "</span>" : "") +
      '<span class="ic"><i class="ti ti-' + s.icon + '"></i></span><h3>' + t(s.name) + "</h3><p>" + t(s.short) + "</p>" + price + "</a>";
  }

  /* бегунок: отмечаем пройденные шаги */
  function runner(el, s) {
    if (!el || !s.route.length) return;
    el.innerHTML =
      '<div class="runner-head"><h3>' + t("Бегунок: " + s.name.toLowerCase()) + '</h3><span class="runner-tag">' + t(s.time) + "</span></div>" +
      '<div class="runner-sub">' + t("Отмечайте врачей по ходу — так видно, сколько осталось") + "</div>" +
      "<ol>" + s.route.map(function (r) {
        return '<li><span class="chk"><i class="ti ti-check"></i></span><span class="stp"><b>' + t(r.place) + "</b><span>" + t(r.text) + "</span></span></li>";
      }).join("") + "</ol>" +
      '<div class="runner-foot"><div class="progress"><i></i></div><span class="cnt">0 из ' + s.route.length + "</span></div>";
    var items = el.querySelectorAll("li"), bar = el.querySelector(".progress i"), cnt = el.querySelector(".cnt");
    items.forEach(function (li) {
      li.addEventListener("click", function () {
        li.classList.toggle("done");
        var n = el.querySelectorAll("li.done").length;
        bar.style.width = (n / items.length * 100) + "%";
        cnt.textContent = n === items.length ? "Готово, справка ваша" : n + " из " + items.length;
      });
    });
  }

  function find(id) { return window.SERVICES.filter(function (s) { return s.id === id; })[0]; }

  /* формы — демо */
  document.querySelectorAll("form.form").forEach(function (f) {
    var sel = f.querySelector("select[name=svc]");
    if (sel && sel.options.length < 2) window.SERVICES.forEach(function (s) { var o = document.createElement("option"); o.textContent = s.name; sel.appendChild(o); });
    f.addEventListener("submit", function (e) { e.preventDefault(); f.classList.add("sent"); });
  });

  if (page === "home") {
    $("#picker").innerHTML = window.SERVICES.slice(0, 4).map(function (s, i) { return svcCard(s, i === 0); }).join("");
    runner($("#runner"), find("voditel"));
    $("#reviews").innerHTML = window.REVIEWS.map(function (r) {
      return '<div class="review rv"><div class="stars">★★★★★</div><p>' + t(r.text) + '</p><div class="who"><b>' + t(r.name) + "</b><span>" + t(r.date + ", отзыв в 2ГИС") + "</span></div></div>";
    }).join("");
    $("#docs").innerHTML = window.DOCTORS.map(function (d) {
      return '<div class="doc rv"><div class="ph">' + t("Фото врача") + '</div><div class="t"><b>' + t(d.name) + "</b><span>" + t(d.role) + "</span></div></div>";
    }).join("");
    $("#faq").innerHTML = window.FAQ.map(function (f) {
      return "<details><summary>" + t(f.q) + '</summary><div class="ans">' + (f.a ? "<p>" + t(f.a) + "</p>" : "") + (f.need ? '<span class="need">' + t(f.need) + "</span>" : "") + "</div></details>";
    }).join("");
    $("#status").textContent = T(st.text);
  }

  if (page === "catalog") {
    var q = $("#q"), list = $("#list"), empty = $("#empty"), tag = "all";
    function draw() {
      var s = q.value.trim().toLowerCase();
      var items = window.SERVICES.filter(function (x) {
        return (tag === "all" || x.tags.indexOf(tag) >= 0) && (!s || (x.name + " " + x.short + " " + (x.keys || "")).replace(/ /g, " ").toLowerCase().indexOf(s) >= 0);
      });
      list.innerHTML = items.map(function (x) { return svcCard(x, false); }).join("");
      empty.style.display = items.length ? "none" : "block";
      list.querySelectorAll(".rv").forEach(function (e) { e.classList.add("in"); });
    }
    q.addEventListener("input", draw);
    document.querySelectorAll(".chip").forEach(function (c) {
      c.addEventListener("click", function () {
        document.querySelectorAll(".chip").forEach(function (x) { x.classList.remove("on"); });
        c.classList.add("on"); tag = c.dataset.tag; draw();
      });
    });
    draw();
  }

  if (page === "item") {
    var s = find(new URLSearchParams(location.search).get("id")) || window.SERVICES[0];
    document.title = s.name + " — Авангард-Мед";
    $("#crumb").textContent = T(s.name);
    $("#name").textContent = T(s.name);
    $("#short").textContent = T(s.short);
    $("#who").innerHTML = s.who.map(function (w) {
      return w.indexOf("Нужно от вас") === 0 ? '<li><span class="need">' + t(w.replace("Нужно от вас: ", "")) + "</span></li>" : '<li><i class="ti ti-check"></i>' + t(w) + "</li>";
    }).join("");
    $("#includes").innerHTML = s.includes ? '<h2>Что входит</h2><ul class="ticks">' + s.includes.map(function (w) { return '<li><i class="ti ti-check"></i>' + t(w) + "</li>"; }).join("") + "</ul>" : '<h2>Что входит</h2><span class="need">' + t("Список врачей и анализов") + "</span>";
    $("#bring").innerHTML = '<span class="need">' + t(s.bring.text) + "</span>";
    if (s.route.length) runner($("#runner"), s); else $("#runner").outerHTML = '<div class="panel"><h2>Маршрут по кабинетам</h2><span class="need">' + t("Порядок кабинетов и этажей") + "</span></div>";
    $("#routeNote").innerHTML = s.routeNote ? '<span class="need">' + t(s.routeNote.replace("Нужно от вас: ", "")) + "</span>" : "";
    $("#price").innerHTML = s.price ? t(s.price) : '<span class="need">' + t(s.priceNeed) + "</span>";
    $("#priceNote").textContent = T(s.priceNote || "");
    $("#time").innerHTML = s.time === "Нужно от вас" ? '<span class="need">' + t("Срок") + "</span>" : t(s.time);
    $("#result").textContent = T(s.result);
    var other = window.SERVICES.filter(function (x) { return x.id !== s.id; }).slice(0, 3);
    $("#other").innerHTML = other.map(function (x) { return svcCard(x, false); }).join("");
  }

  if (page === "article") {
    var a = window.ARTICLES[0];
    $("#title").textContent = T(a.title);
    $("#lead").textContent = T(a.lead);
    $("#src").innerHTML = '<span class="need">' + t(a.source.replace(". Нужно от вас: проверить", ", проверить маршрут")) + "</span>";
    $("#steps").innerHTML = a.blocks.map(function (b, i) {
      return '<div class="step rv"><span class="n">' + (i + 1) + "</span><div><h3>" + t(b.h) + "</h3><p>" + t(b.p) + "</p></div></div>";
    }).join("");
  }

  /* появление при прокрутке */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: .12 }) : null;
  document.querySelectorAll(".rv").forEach(function (e) { io ? io.observe(e) : e.classList.add("in"); });
})();
