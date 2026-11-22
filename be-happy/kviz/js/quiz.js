/* Квиз БиХэппи. Программы и цены — карточка центра в 2ГИС (16.09.2026) и сайт behappy42.ru */
(function () {
  var T = window.typo || function (s) { return s; };
  var P = {
    "eng-kids": { e: "🧸", t: "Английский для малышей", d: "3–5 лет: язык через игры, песни и истории. Первые успехи с первого занятия.", pr: "от 565 ₽ за занятие" },
    "kidsbox": { e: "📦", t: "Kids Box", d: "6–8 лет: лексика и грамматика через игру, чтение, письмо и устная речь. К школьному английскому — уже читающим.", pr: "от 600 ₽ за занятие" },
    "gogetter": { e: "🚀", t: "Go Getter", d: "9–14 лет: разговор, грамматика и словарный запас через живые ситуации и видео. Помогает со школьной программой.", pr: "от 675 ₽ за занятие" },
    "prepare": { e: "🎓", t: "Prepare: ОГЭ и ЕГЭ", d: "7–11 класс: мини-группы 3–8 человек, занятие 60 минут, типовые экзаменационные задания и пробные тесты.", pr: "675–775 ₽ за занятие" },
    "chinese": { e: "🐉", t: "Китайский язык", d: "Группа или индивидуально, с нуля. Основатель центра жила и работала в Китае.", pr: "от 675 ₽ за занятие" },
    "french": { e: "🥐", t: "Французский язык", d: "Индивидуальные занятия с переводчиком английского и французского.", pr: "от 1 000 ₽ за занятие" },
    "german": { e: "🥨", t: "Немецкий язык", d: "Индивидуальные занятия с лингвистом-переводчиком.", pr: "цену подскажет администратор" },
    "start": { e: "✏️", t: "Подготовка к школе «Первый старт»", d: "Память, внимание и мышление. Можно в КОМБО с нейрогимнастикой, скорочтением и каллиграфией.", pr: "от 500 ₽ за занятие" },
    "read": { e: "📖", t: "Скорочтение и каллиграфия", d: "Учим быстро читать, запоминать и продуктивно обрабатывать информацию.", pr: "от 500 ₽ за занятие" },
    "speech": { e: "🎤", t: "Школа речи «Меня слышно»", d: "Голос, дикция и уверенность. Две ступени — от первого слова до выхода на сцену.", pr: "цену подскажет администратор" },
    "chess": { e: "♟️", t: "Шахматный клуб", d: "Логика, концентрация, усидчивость. Для начинающих и тех, кто хочет вырасти.", pr: "цену подскажет администратор" },
    "camp": { e: "☀️", t: "Городской лагерь с английским", d: "Недельные тематические смены с 09:00 до 17:00, выезды и английский каждый день.", pr: "лето 2026 — от 10 000 ₽ за смену" },
    "eng-adult": { e: "☕", t: "Английский для взрослых", d: "Индивидуальная программа под ваш запрос и цель.", pr: "от 1 000 ₽ за занятие" }
  };

  var steps = [
    { id: "who", q: "Кого записываем?", hint: "Учим детей с трёх лет и взрослых", opts: [
      { v: "child", e: "🧒", t: "Ребёнка" }, { v: "adult", e: "🙋", t: "Себя", s: "взрослый" }] },
    { id: "age", q: "Сколько лет ребёнку?", hint: "От возраста зависит программа", show: function (a) { return a.who === "child"; }, opts: [
      { v: "3", e: "🧸", t: "3–5 лет" }, { v: "6", e: "🎒", t: "6–8 лет", s: "1–2 класс" }, { v: "9", e: "📚", t: "9–12 лет", s: "3–6 класс" }, { v: "13", e: "🎧", t: "13–17 лет", s: "7–11 класс" }] },
    { id: "goal", q: "Что сейчас важнее всего?", hint: "Выберите главное — остальное обсудим на пробном", opts: function (a) {
      if (a.who === "adult") return [
        { v: "lang", e: "🗣️", t: "Иностранный язык", s: "английский, китайский, французский" },
        { v: "speech", e: "🎤", t: "Уверенная речь", s: "голос, дикция, выступления" },
        { v: "chess", e: "♟️", t: "Шахматы" }];
      var o = [{ v: "lang", e: "🗣️", t: "Заговорить и полюбить язык" }];
      if (a.age !== "3") o.push({ v: "school", e: "✅", t: "Подтянуть английский в школе" });
      if (a.age === "13") o.push({ v: "exam", e: "🎓", t: "Сдать ОГЭ или ЕГЭ" });
      if (a.age === "3" || a.age === "6") o.push({ v: "prep", e: "✏️", t: "Подготовиться к школе", s: "память, внимание, чтение" });
      o.push({ v: "speech", e: "🎤", t: "Стать увереннее", s: "речь, сцена" });
      if (a.age !== "3") o.push({ v: "chess", e: "♟️", t: "Логика и концентрация", s: "шахматы" });
      o.push({ v: "camp", e: "☀️", t: "Занять каникулы", s: "городской лагерь" });
      return o; } },
    { id: "lang", q: "Какой язык?", hint: "В БиХэппи можно учить сразу несколько", show: function (a) { return a.goal === "lang"; }, opts: [
      { v: "en", e: "🇬🇧", t: "Английский" }, { v: "zh", e: "🇨🇳", t: "Китайский" }, { v: "fr", e: "🇫🇷", t: "Французский" }, { v: "de", e: "🇩🇪", t: "Немецкий" }] },
    { id: "branch", q: "Где удобнее заниматься?", hint: "Оба филиала — в Центральном районе", opts: [
      { v: "Притомский", e: "📍", t: "Притомский, 35 к2", s: "у остановки «15-й микрорайон»" },
      { v: "Заречная", e: "📍", t: "2-я Заречная, 20", s: "ЖК «Кемерово-Сити»" },
      { v: "Онлайн", e: "💻", t: "Онлайн" }, { v: "Неважно", e: "🤷", t: "Неважно" }] },
    { id: "shift", q: "В какую смену учится в школе?", hint: "Соберём группу так, чтобы занятия не пересекались с уроками", show: function (a) { return a.who === "child" && a.goal !== "camp"; }, opts: [
      { v: "1", e: "🌅", t: "Первая смена" }, { v: "2", e: "🌇", t: "Вторая смена" }, { v: "0", e: "🧸", t: "Ещё не ходит в школу" }, { v: "?", e: "❔", t: "Пока не знаем" }] }
  ];

  function pick(a) {
    if (a.goal === "camp") return "camp";
    if (a.goal === "speech") return "speech";
    if (a.goal === "chess") return "chess";
    if (a.goal === "prep") return a.age === "3" ? "start" : "read";
    if (a.goal === "exam") return "prepare";
    if (a.goal === "lang" && a.lang && a.lang !== "en") return { zh: "chinese", fr: "french", de: "german" }[a.lang];
    if (a.who === "adult") return "eng-adult";
    return { "3": "eng-kids", "6": "kidsbox", "9": "gogetter", "13": a.goal === "school" ? "gogetter" : "prepare" }[a.age];
  }

  var A = {}, hist = [], box = document.getElementById("q"), map = document.getElementById("map");
  var back = document.getElementById("back"), stepN = document.getElementById("stepN");
  function esc(s) { return String(T(s)).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function visible() { var X = Object.assign({ who: "child" }, A); return steps.filter(function (s) { return !s.show || s.show(X); }); }

  function drawMap(i, total) {
    var h = "";
    for (var k = 0; k < total; k++) h += '<i class="' + (k < i ? "done" : k === i ? "now" : "") + '">' + (k < i ? "★" : k + 1) + "</i>";
    h += '<i class="gift' + (i >= total ? " done" : "") + '">🎁</i>';
    map.innerHTML = h;
  }

  function show(i) {
    var vis = visible();
    back.hidden = hist.length === 0;
    if (i >= vis.length) return result(vis.length);
    var s = vis[i], opts = typeof s.opts === "function" ? s.opts(A) : s.opts;
    drawMap(i, vis.length);
    stepN.textContent = "Вопрос " + (i + 1) + " из " + vis.length;
    box.innerHTML = '<div class="q"><h2>' + esc(s.q) + '</h2><p class="hint">' + esc(s.hint) + '</p><div class="opts">' +
      opts.map(function (o) { return '<button class="opt' + (A[s.id] === o.v ? " on" : "") + '" data-v="' + o.v + '"><span class="e">' + o.e + "</span><span>" + esc(o.t) + (o.s ? "<small>" + esc(o.s) + "</small>" : "") + "</span></button>"; }).join("") + "</div></div>";
    box.querySelectorAll(".opt").forEach(function (b) {
      b.addEventListener("click", function () {
        A[s.id] = b.dataset.v;
        if (s.id === "who") { delete A.age; delete A.goal; delete A.lang; }
        if (s.id === "age") { delete A.goal; delete A.lang; }
        if (s.id === "goal" && A.goal !== "lang") delete A.lang;
        b.classList.add("on");
        hist.push(i);
        setTimeout(function () { show(i + 1); }, 180);
      });
    });
  }

  function result(total) {
    drawMap(total, total);
    stepN.textContent = "Готово!";
    var p = P[pick(A)];
    var where = A.branch && A.branch !== "Неважно" ? (A.branch === "Онлайн" ? "онлайн" : "на филиале «" + A.branch + "»") : "на удобном филиале";
    box.innerHTML = '<div class="q"><div class="res"><div class="e">' + p.e + '</div><div><small>Вам подойдёт</small><h3>' + esc(p.t) + "</h3><p>" + esc(p.d) + '</p><div class="pr">' + esc(p.pr) + "</div></div></div>" +
      '<p class="also">' + esc("Подберём " + (A.who === "adult" ? "время занятий " : "группу ") + where + (A.shift === "1" ? " после уроков первой смены" : A.shift === "2" ? " до уроков второй смены" : "") + ". Куда прислать расписание и время пробного занятия?") + "</p>" +
      '<form class="form" id="lead"><input required placeholder="Ваше имя"><input required type="tel" placeholder="Телефон, +7"><div class="msgr">' +
      ["WhatsApp", "Telegram", "MAX", "Позвонить"].map(function (m, k) { return '<button type="button" class="' + (k === 0 ? "on" : "") + '">' + m + "</button>"; }).join("") +
      '</div><button class="btn btn-sun" type="submit">Получить расписание</button><small>Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных.</small></form></div>';
    box.querySelectorAll(".msgr button").forEach(function (b) {
      b.addEventListener("click", function () { box.querySelectorAll(".msgr button").forEach(function (x) { x.classList.toggle("on", x === b); }); });
    });
    document.getElementById("lead").addEventListener("submit", function (e) {
      e.preventDefault();
      back.hidden = true;
      stepN.textContent = "";
      box.innerHTML = '<div class="done"><div class="big">🎉</div><h2>Спасибо!</h2><p>' + esc("Администратор напишет вам в выбранный мессенджер и предложит время пробного занятия.") +
        '</p><div class="proto">' + esc("Это прототип: заявка никуда не ушла. На готовом сайте ответы квиза придут администратору в Telegram и в таблицу.") + "</div></div>";
    });
  }

  back.addEventListener("click", function () { if (hist.length) show(hist.pop()); });
  document.querySelectorAll("[data-restart]").forEach(function (b) {
    b.addEventListener("click", function () { A = {}; hist = []; show(0); document.getElementById("quiz").scrollIntoView({ behavior: "smooth" }); });
  });
  show(0);
})();
