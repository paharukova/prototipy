/*
 * Баннер cookie + Яндекс Метрика — только после согласия посетителя.
 *
 * Как включить Метрику: создать счётчик на metrika.yandex.ru и вписать его номер
 * в METRIKA_ID ниже (например, 12345678). Пока номер пустой — Метрика не грузится вовсе,
 * а баннер всё равно показывается, чтобы было видно, как он выглядит.
 *
 * Закон (152-ФЗ): cookie Метрики — персональные данные, поэтому
 *  — счётчик запускается ТОЛЬКО после «Принять»; до этого и после «Отклонить» — нет;
 *  — кнопки «Принять» и «Отклонить» одинаковые по виду и размеру;
 *  — передумать можно в любой момент: ссылка «Настройки cookie» в подвале.
 * Выбор хранится в браузере посетителя (localStorage) 1 год, потом баннер спросит снова.
 */
(function () {
  var METRIKA_ID = '';          // ← номер счётчика Яндекс Метрики
  var WEBVISOR = false;          // Вебвизор записывает действия на странице. Включать только вместе с правкой политики cookie
  var KEY = 'ck-consent';
  var YEAR = 365 * 24 * 60 * 60 * 1000;
  var NB = ' ';

  function read() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (v && (v.c === 'all' || v.c === 'none') && Date.now() - v.d < YEAR) return v.c;
    } catch (e) {}
    return null;
  }
  function save(c) {
    try { localStorage.setItem(KEY, JSON.stringify({ c: c, d: Date.now() })); } catch (e) {}
  }

  /* ---------- Яндекс Метрика ---------- */
  var loaded = false;
  function loadMetrika() {
    if (loaded || !METRIKA_ID) return;
    loaded = true;
    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date();
      k = e.createElement(t); a = e.getElementsByTagName(t)[0];
      k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
    window.ym(Number(METRIKA_ID), 'init', {
      clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: WEBVISOR
    });
  }
  /* Отзыв согласия: стираем cookie Метрики (_ym…) и перезагружаем страницу без счётчика */
  function dropMetrika() {
    var host = location.hostname, parts = host.split('.');
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ym') !== 0) return;
      for (var i = 0; i < parts.length - 1; i++) {
        var dom = parts.slice(i).join('.');
        document.cookie = name + '=; Max-Age=0; path=/; domain=.' + dom;
      }
      document.cookie = name + '=; Max-Age=0; path=/';
    });
  }

  /* ---------- Баннер ---------- */
  var css =
    /* 21.11: баннер компактный — на компьютере маленькая карточка в правом нижнем углу, на телефоне — сверху под шапкой */
    '.ck{position:fixed;z-index:60;right:16px;bottom:16px;width:280px;box-sizing:border-box;' +
    'display:flex;flex-direction:column;gap:10px;padding:12px 12px 12px 14px;' +
    'background:var(--paper,#fbfaf9);color:var(--ink,#1f1a1b);border:1px solid var(--line,#dcd7d4);' +
    'box-shadow:0 12px 26px -14px rgba(60,8,20,.4);font:12px/1.45 Manrope,Arial,sans-serif;' +
    'opacity:0;transform:translateY(12px);transition:opacity .25s,transform .25s}' +
    '.ck.show{opacity:1;transform:none}' +
    '.ck p{margin:0;flex:1}' +
    '.ck a{color:var(--wine,#6b1222);text-decoration:underline;text-underline-offset:2px}' +
    '.ck-btns{display:grid;grid-template-columns:1fr 1fr;gap:6px;flex:none}' +
    '.ck-btns button{appearance:none;cursor:pointer;min-height:32px;padding:7px 10px;border:1px solid var(--wine,#6b1222);' +
    'font:700 10px/1 Manrope,Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;border-radius:0;transition:background .2s,color .2s}' +
    '.ck-yes{background:var(--wine,#6b1222);color:#fff}' +
    '.ck-no{background:#fff;color:var(--wine,#6b1222)}' +
    '.ck-btns button:hover,.ck-btns button:focus-visible{background:#4f0c18;color:#fff;border-color:#4f0c18}' +
    '.ck-btns button:focus-visible{outline:2px solid var(--wine,#6b1222);outline-offset:2px}' +
    'body.ck-open .float-msg{display:none!important}' +
    /* телефон: на главной баннер сверху, сразу под закреплённой шапкой — не закрывает кнопки первого экрана;
       на страницах без шапки (политика, согласие) — внизу */
    '@media (max-width:760px){.ck{left:10px;right:10px;bottom:10px;width:auto;align-items:stretch;gap:10px;padding:12px 12px 10px;font-size:12px}' +
    '.ck.ck-top{top:var(--ck-top,106px);bottom:auto;transform:translateY(-12px)}.ck.ck-top.show{transform:none}' +
    '.ck-btns button{min-height:38px}}' +
    '@media (prefers-reduced-motion:reduce){.ck{transition:none}}';

  var box = null;
  function close() {
    if (!box) return;
    box.classList.remove('show');
    document.body.classList.remove('ck-open');
    var b = box; box = null;
    setTimeout(function () { b.remove(); }, 260);
  }
  function choose(c) {
    var before = read();
    save(c);
    close();
    if (c === 'all') loadMetrika();
    else if (before === 'all' || loaded) { dropMetrika(); location.reload(); }
  }
  function show() {
    if (box) return;
    if (!document.getElementById('ck-style')) {
      var st = document.createElement('style'); st.id = 'ck-style'; st.textContent = css;
      document.head.appendChild(st);
    }
    box = document.createElement('div');
    box.className = 'ck';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', 'Файлы cookie');
    box.innerHTML =
      '<p>Сайт использует cookie. Яндекс' + NB + 'Метрика включится только с' + NB + 'вашего согласия. ' +
      '<a href="cookie.html">Подробнее</a></p>' +
      '<div class="ck-btns"><button type="button" class="ck-yes">Принять</button><button type="button" class="ck-no">Отклонить</button></div>';
    box.querySelector('.ck-yes').addEventListener('click', function () { choose('all'); });
    box.querySelector('.ck-no').addEventListener('click', function () { choose('none'); });
    var hd = document.querySelector('.header');
    if (hd) { box.classList.add('ck-top'); box.style.setProperty('--ck-top', (hd.offsetHeight + 9) + 'px'); }
    document.body.appendChild(box);
    document.body.classList.add('ck-open');
    void box.offsetWidth; // браузер «замечает» баннер, и плавное появление срабатывает
    box.classList.add('show');
  }

  /* Ссылка «Настройки cookie» в подвале и на странице политики: <a href="#" data-cookie-settings> */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-cookie-settings]');
    if (!a) return;
    e.preventDefault();
    show();
  });

  function start() {
    var c = read();
    if (c === 'all') loadMetrika();
    else if (c === null) show();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
