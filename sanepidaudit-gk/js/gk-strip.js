/* Полоса сайта группы над страницами медицинских центров (АМР-Мед, Авангард-Мед).
   Подключение — первой строкой в <body>: <script src="../js/gk-strip.js" data-org="amr"></script>
   Показывает, что медцентр — направление сайта ГК, и даёт вернуться или перейти в другое направление. */
(function () {
  var me = document.currentScript;
  var org = me && me.getAttribute("data-org");
  var ORGS = {
    amr: { name: "АМР-Мед", other: "avangard", otherName: "Авангард-Мед", otherWhat: "справки и медосмотры на работу" },
    avangard: { name: "Авангард-Мед", other: "amr", otherName: "АМР-Мед", otherWhat: "предрейсовые и предсменные осмотры" }
  };
  var o = ORGS[org] || ORGS.amr;
  var DIRS = [
    ["../amr-med/index.html", "Медицина: АМР-Мед"],
    ["../avangard-med/index.html", "Медицина: Авангард-Мед"],
    ["../laboratoriya.html", "Лаборатория"],
    ["../proektirovanie-ekspertizy.html", "Проектирование и экспертизы"],
    ["../konsalting-audit.html", "Консалтинг и аудит"],
    ["../sanitarnaya-obrabotka.html", "Санитарная обработка"],
    ["../utilizaciya.html", "Утилизация"]
  ];
  var mark = '<svg width="22" height="21" viewBox="0 0 102.86 96" aria-hidden="true">' +
    [0, 1, 2, 3, 4, 5].map(function (i) {
      var h = 96 * (i + 1) / 6;
      return '<rect x="' + (i * 17.65).toFixed(2) + '" y="' + (96 - h).toFixed(2) + '" width="14.6" height="' + h.toFixed(2) + '" rx="2.1" fill="' + (i === 5 ? "#1F6FD1" : "#FFFFFF") + '"/>';
    }).join("") + "</svg>";

  var css =
    ".gk-strip{background:#15263A;color:#C9D1DA;font:600 14px/1.3 Manrope,system-ui,sans-serif;position:relative;z-index:30}" +
    ".gk-strip .gk-in{max-width:1200px;margin:0 auto;padding:8px 32px;display:flex;align-items:center;gap:10px 18px;flex-wrap:wrap}" +
    ".gk-strip a{color:#fff;text-decoration:none}.gk-strip a:hover{text-decoration:underline}" +
    ".gk-crumbs{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.gk-crumbs svg{flex:none}.gk-crumbs .sep{color:#6F7F92}.gk-crumbs b{color:#E9A45B}" +
    ".gk-right{margin-left:auto;display:flex;align-items:center;gap:16px;flex-wrap:wrap}" +
    ".gk-other small{color:#AEBBC9;font-weight:500}" +
    ".gk-dirs{position:relative}.gk-dirs summary{cursor:pointer;color:#fff;list-style:none}.gk-dirs summary::-webkit-details-marker{display:none}.gk-dirs summary::after{content:' ▾'}" +
    ".gk-dirs ul{position:absolute;right:0;top:calc(100% + 8px);background:#fff;border-radius:12px;box-shadow:0 12px 32px rgba(21,38,58,.22);list-style:none;margin:0;padding:8px;min-width:260px}" +
    ".gk-dirs li a{display:block;padding:9px 12px;border-radius:8px;color:#15263A}.gk-dirs li a:hover{background:#F4F5F7;text-decoration:none}.gk-dirs li a.on{color:#1F6FD1}" +
    ".gk-proto{background:#22374F;color:#C9D1DA;font:500 13px/1.4 Manrope,system-ui,sans-serif;text-align:center;padding:6px 16px}.gk-proto b{color:#E9A45B}" +
    "@media(max-width:640px){.gk-strip .gk-in{padding:8px 16px;flex-wrap:nowrap}.gk-other,.gk-crumbs .sep,.gk-crumbs .gk-med,.gk-crumbs b{display:none}.gk-right{margin-left:auto}.gk-crumbs{flex-wrap:nowrap}.gk-dirs summary{white-space:nowrap}.gk-proto{font-size:12px}.gk-dirs ul{right:0;max-width:calc(100vw - 32px)}}";

  var here = location.pathname;
  var html =
    "<style>" + css + "</style>" +
    '<div class="gk-proto"><b>Прототип, версия 4</b> — медицинский центр открывается внутри сайта группы, как и остальные направления.</div>' +
    '<div class="gk-strip"><div class="gk-in">' +
    '<nav class="gk-crumbs" aria-label="Сайт группы">' + mark +
    '<a href="../index.html">ГК «Санэпидаудит-Кузбасс»</a><span class="sep">›</span>' +
    '<a class="gk-med" href="../index.html#dir-med">Медицина</a><span class="sep">›</span><b>' + o.name + "</b></nav>" +
    '<div class="gk-right">' +
    '<a class="gk-other" href="../' + o.other + '-med/index.html">' + o.otherName + " <small>— " + o.otherWhat + "</small> →</a>" +
    '<details class="gk-dirs"><summary>Все направления</summary><ul>' +
    DIRS.map(function (d) {
      var on = here.indexOf(d[0].replace("../", "").replace("index.html", "")) >= 0 && d[0].indexOf("-med/") > 0;
      return '<li><a href="' + d[0] + '"' + (on ? ' class="on"' : "") + ">" + d[1] + "</a></li>";
    }).join("") +
    "</ul></details></div></div></div>";

  if (me) me.insertAdjacentHTML("afterend", html);

  document.addEventListener("click", function (e) {
    var dd = document.querySelector(".gk-dirs[open]");
    if (dd && !dd.contains(e.target)) dd.removeAttribute("open");
  });
})();
