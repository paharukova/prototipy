(function () {
  var D = window.BH, T = window.typo || function (s) { return s; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function t(s) { return esc(T(s)); }
  function priceHtml(p) { return p.price ? t(p.price) + ' <small>/ занятие*</small>' : '<small>цену уточним</small>'; }

  /* меню на телефоне */
  var burger = $(".burger");
  if (burger) burger.addEventListener("click", function () { $(".nav").classList.toggle("open"); });

  /* карточка направления */
  function card(p) {
    var ages = p.ages.map(function (a) { var x = D.ages.filter(function (g) { return g.id === a; })[0]; return '<span class="tag">' + t(x.label) + "</span>"; }).join("");
    return '<a class="card rv" href="program.html?id=' + p.id + '"><div class="ico">' + p.ico + "</div><h3>" + t(p.title) + "</h3><p>" + t(p.short) + '</p><div class="meta">' + ages + '</div><div class="price">' + priceHtml(p) + "</div></a>";
  }

  /* главная: выбор возраста */
  var ageBox = $("#ageList");
  if (ageBox) {
    var tabs = $("#ageTabs");
    tabs.innerHTML = D.ages.map(function (a, i) { return '<button class="chip' + (i === 1 ? " on" : "") + '" data-a="' + a.id + '">' + t(a.label) + "</button>"; }).join("");
    var drawAge = function (id) {
      ageBox.innerHTML = D.programs.filter(function (p) { return p.ages.indexOf(id) >= 0; }).map(function (p) {
        return '<a class="age-card" href="program.html?id=' + p.id + '"><b>' + p.ico + " " + t(p.title) + "</b><span>" + t(p.short) + "</span><em>" + (p.price ? t(p.price) : "цену уточним") + "</em></a>";
      }).join("");
    };
    tabs.addEventListener("click", function (e) {
      var b = e.target.closest(".chip"); if (!b) return;
      $$(".chip", tabs).forEach(function (x) { x.classList.toggle("on", x === b); });
      drawAge(b.dataset.a);
    });
    drawAge("a6");
  }

  /* главная: избранные направления */
  var fav = $("#favCards");
  if (fav) {
    fav.innerHTML = ["eng-kids", "kidsbox", "gogetter", "prepare", "chinese", "start"].map(function (id) {
      return card(D.programs.filter(function (p) { return p.id === id; })[0]);
    }).join("");
  }

  /* отзывы */
  var rev = $("#reviews");
  if (rev) {
    var list = D.reviews.slice(0, +(rev.dataset.n || 9));
    rev.innerHTML = list.map(function (r) {
      return '<article class="review rv"><div class="stars">★★★★★</div><p>' + t(r.text) + "</p><footer><b>" + t(r.name) + "</b><span>" + t(r.date) + " · 2ГИС</span></footer></article>";
    }).join("");
  }

  /* смены лагеря */
  var sh = $("#shifts");
  if (sh) sh.innerHTML = D.shifts.map(function (s) { return '<div class="shift"><b>' + t(s.t) + "</b><span>" + t(s.d) + "</span></div>"; }).join("");

  /* каталог */
  var grid = $("#catalog");
  if (grid) {
    var st = { kind: "all", age: "all", q: "" };
    var params = new URLSearchParams(location.search);
    if (params.get("kind")) st.kind = params.get("kind");
    if (params.get("age")) st.age = params.get("age");
    var mk = function (box, items, key) {
      box.innerHTML = '<button class="fchip" data-v="all">Все</button>' + items.map(function (x) { return '<button class="fchip" data-v="' + x.id + '">' + t(x.label) + "</button>"; }).join("");
      var sync = function () { $$(".fchip", box).forEach(function (b) { b.classList.toggle("on", b.dataset.v === st[key]); }); };
      box.addEventListener("click", function (e) { var b = e.target.closest(".fchip"); if (!b) return; st[key] = b.dataset.v; sync(); draw(); });
      sync();
    };
    var draw = function () {
      var q = st.q.trim().toLowerCase();
      var res = D.programs.filter(function (p) {
        return (st.kind === "all" || p.kind === st.kind) && (st.age === "all" || p.ages.indexOf(st.age) >= 0) &&
          (!q || (p.title + " " + p.short + " " + p.text).toLowerCase().indexOf(q) >= 0);
      });
      grid.innerHTML = res.map(card).join("");
      $("#empty").style.display = res.length ? "none" : "block";
      $("#count").textContent = res.length;
      reveal();
    };
    mk($("#fKind"), D.kinds, "kind");
    mk($("#fAge"), D.ages, "age");
    $("#q").addEventListener("input", function (e) { st.q = e.target.value; draw(); });
    draw();
  }

  /* карточка программы */
  var pg = $("#program");
  if (pg) {
    var id = new URLSearchParams(location.search).get("id") || "kidsbox";
    var p = D.programs.filter(function (x) { return x.id === id; })[0] || D.programs[1];
    document.title = p.title + " — БиХэппи, Кемерово";
    $("#pCrumb").textContent = T(p.title);
    $("#pIco").textContent = p.ico;
    $("#pTitle").textContent = T(p.title);
    $("#pShort").textContent = T(p.short);
    $("#pText").textContent = T(p.text);
    $("#pFacts").innerHTML = p.facts.map(function (f) { return "<div><span>" + t(f[0]) + "</span><b>" + t(f[1]) + "</b></div>"; }).join("");
    $("#pPlus").innerHTML = p.plus.map(function (x) { return "<li>" + t(x) + "</li>"; }).join("");
    $("#pPrice").innerHTML = priceHtml(p);
    $("#pSrc").textContent = "Источник: " + p.src;
    var sim = D.programs.filter(function (x) { return x.id !== p.id && x.kind === p.kind; }).slice(0, 3);
    $("#pSimilar").innerHTML = sim.map(card).join("");
    var sel = $("#fProg"); if (sel) sel.value = p.title;
  }

  /* филиалы: открыто сейчас (2ГИС: Притомский — с 09:00 по записи, Заречная — ежедневно 09:00–20:00) */
  $$(".open-now").forEach(function (el) {
    var h = new Date().getHours(), from = +el.dataset.from, to = +el.dataset.to;
    var open = h >= from && h < to;
    el.classList.add(open ? "yes" : "no");
    el.textContent = open ? "Сейчас открыто · до " + to + ":00" : "Сейчас закрыто · откроется в " + (from < 10 ? "0" : "") + from + ":00";
  });

  /* формы — демо */
  $$("form.form").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      $$("input,select,label,button,.row,small", f).forEach(function (x) { x.style.display = "none"; });
      $(".form-ok", f).style.display = "block";
    });
  });

  /* прогресс BeHappy Exams */
  var bars = $$(".bar i");
  if (bars.length && "IntersectionObserver" in window) {
    var io2 = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.style.width = e.target.dataset.w; io2.unobserve(e.target); } }); });
    bars.forEach(function (b) { io2.observe(b); });
  } else bars.forEach(function (b) { b.style.width = b.dataset.w; });

  /* появление при прокрутке */
  var io;
  function reveal() {
    var els = $$(".rv:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    io = io || new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (e) { io.observe(e); });
  }
  reveal();
})();
