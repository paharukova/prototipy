(function () {
  var D = window.DATA, T = window.typo;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  /* открыто сейчас — по графику из группы ВК (Кемерово, UTC+7) */
  $$("[data-open-now]").forEach(function (n) {
    var now = new Date(Date.now() + (7 * 60 + new Date().getTimezoneOffset()) * 60000);
    var h = D.hours[now.getDay()], t = now.getHours() + now.getMinutes() / 60;
    var fmt = function (x) { var m = Math.round((x % 1) * 60); return Math.floor(x) + ":" + (m < 10 ? "0" : "") + m; };
    if (h && t >= h[0] && t < h[1]) { n.textContent = "Открыто до " + fmt(h[1]); }
    else { n.textContent = "Сейчас закрыто"; n.classList.add("closed"); }
  });

  /* клиенты */
  var cl = $("#clients");
  if (cl) D.clients.forEach(function (c) { cl.appendChild(el("span", "", T(c))); });

  /* отзывы */
  function reviews(box, list) {
    if (!box) return;
    list.forEach(function (r) {
      var c = el("div", "review reveal");
      var q = el("q"); q.textContent = T(r.text);
      c.appendChild(q);
      c.appendChild(el("div", "who-r", T(r.who) + "<span>" + T(r.where) + "</span>"));
      box.appendChild(c);
    });
  }
  reviews($("#reviews-b2b"), D.reviewsB2B);
  reviews($("#reviews-pat"), D.reviewsPat);

  /* врачи и фильтр */
  var docs = $("#doctors");
  if (docs) {
    D.doctors.forEach(function (d, i) {
      var c = el("div", "doc reveal");
      c.dataset.tags = d.tags.join(" ");
      c.innerHTML = '<div class="ph">Фото врача<br>в халате, на светлом фоне</div><div class="body"><h3></h3><div class="spec"></div><ul></ul>' +
        '<span class="need" style="margin-bottom:14px">Цена приёма — нужно от вас</span><a class="btn btn-main" href="#book">Записаться</a></div>';
      var nm = d.name.split(" "); $("h3", c).innerHTML = nm[0] + "<br>" + nm.slice(1).join(" ");
      $(".spec", c).textContent = d.spec;
      d.facts.forEach(function (f) { var li = el("li"); li.textContent = T(f); $("ul", c).appendChild(li); });
      $(".btn", c).addEventListener("click", function () { var s = $("#doc-select"); if (s) s.value = String(i); });
      docs.appendChild(c);
    });
    $$(".spec-filter .chip").forEach(function (b) {
      b.addEventListener("click", function () {
        $$(".spec-filter .chip").forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        var f = b.dataset.f;
        $$(".doc", docs).forEach(function (c) { c.style.display = (f === "all" || c.dataset.tags.indexOf(f) >= 0) ? "" : "none"; });
      });
    });
    var sel = $("#doc-select");
    if (sel) D.doctors.forEach(function (d, i) { var o = el("option"); o.value = i; o.textContent = d.name + " — " + d.spec.toLowerCase(); sel.appendChild(o); });
  }

  /* услуги пациентам */
  var sv = $("#services");
  if (sv) D.services.forEach(function (s) {
    sv.appendChild(el("div", "svc reveal", "<div><b>" + T(s.name) + "</b><span>" + T(s.note) + '</span></div><span class="need">цена</span>'));
  });

  /* слоты записи — для примера */
  var slots = $("#slots");
  if (slots) {
    ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30"].forEach(function (t, i) {
      var b = el("button", "slot", t); b.type = "button";
      if (i === 1 || i === 4) b.disabled = true;
      b.addEventListener("click", function () { $$(".slot").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); });
      slots.appendChild(b);
    });
  }

  /* подбор формата осмотров */
  var calc = $("#calc");
  if (calc) {
    var st = { size: "1–5", where: "center" };
    $$(".chips", calc).forEach(function (g) {
      $$(".chip", g).forEach(function (b) {
        b.addEventListener("click", function () {
          $$(".chip", g).forEach(function (x) { x.classList.remove("on"); });
          b.classList.add("on"); st[g.dataset.q] = b.dataset.v; upd();
        });
      });
    });
    function upd() {
      var big = st.size === "50+" || st.size === "16–50";
      var t, r;
      if (st.where === "far") { t = "Дистанционный осмотр на вашей площадке"; r = "Ставим комплекс AMR DIMECO у вас на объекте, врач проверяет показатели онлайн. Так уже работаем для РЖД и в ХМАО."; }
      else if (st.where === "own" || big) { t = "Комплекс AMR DIMECO у вас на предприятии"; r = "Когда водителей " + st.size + ", осмотр удобнее проводить на месте: водители не тратят время на дорогу, а сам осмотр занимает до 30 секунд."; }
      else { t = "Осмотр в центре на Мичурина, 15"; r = "Водитель приходит перед рейсом, проходит осмотр и получает штамп и подпись медика в путевом листе."; }
      $("#calc-title").textContent = T(t);
      $("#calc-rec").textContent = T(r);
      $("#calc-hidden").value = st.size + " водителей, " + t;
    }
    upd();
  }

  /* формы — демо */
  $$("form[data-demo]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      f.style.display = "none";
      var th = f.parentNode.querySelector(".thanks");
      if (th) th.style.display = "block";
    });
  });

  /* появление при прокрутке */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: .12 }) : null;
  $$(".reveal").forEach(function (n) { io ? io.observe(n) : n.classList.add("in"); });
})();
