(function () {
  var T = window.typo || function (s) { return s; };
  /* Где лежат политика и согласие: страница во вложенной папке пишет <html data-docs="../"> */
  var DOCS = document.documentElement.getAttribute('data-docs') || '';

  /* Меню на телефоне */
  var nav = document.getElementById('nav'), menuBtn = document.querySelector('.menu-btn');
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); });
    });
  }

  /* Плавающая кнопка «Написать Ирине» — только после первого экрана и не над формой связи */
  var floatBtn = document.querySelector('.float-msg'), hero = document.querySelector('.hero'), contact = document.getElementById('contact');
  if (floatBtn && hero) {
    var onScroll = function () {
      var past = hero.getBoundingClientRect().bottom < 0;
      var atContact = contact && contact.getBoundingClientRect().top < window.innerHeight;
      floatBtn.classList.toggle('show', past && !atContact);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Заголовок первого экрана — ровно в три строки: если строка не влезает в колонку, чуть уменьшаем буквы */
  var h1 = document.querySelector('.hero h1');
  if (h1 && h1.querySelector('.h1-line')) {
    var fitH1 = function () {
      h1.style.fontSize = '';
      var lines = [].slice.call(h1.querySelectorAll('.h1-line'));
      if (getComputedStyle(lines[0]).whiteSpace !== 'nowrap') return; /* на телефоне строки переносятся сами */
      var fs = parseFloat(getComputedStyle(h1).fontSize);
      var over = function () { return lines.some(function (l) { return l.scrollWidth > l.clientWidth + 1; }); };
      while (over() && fs > 18) { fs -= 0.5; h1.style.fontSize = fs + 'px'; }
    };
    fitH1();
    window.addEventListener('resize', fitH1);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitH1);
  }

  /* Появление блоков при прокрутке */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } });
  }, { threshold: 0.12 }) : null;
  document.querySelectorAll('.reveal').forEach(function (el) { io ? io.observe(el) : el.classList.add('on'); });

  /* Линия городов — без интерактивности (решение Татьяны 13.11): просто плитки */

  /* «Шесть шагов» оживают при прокрутке: линия заполняется, шаги загораются по очереди */
  var tl = document.querySelector('.timeline');
  if (tl) {
    var steps = [].slice.call(tl.querySelectorAll('.milestone'));
    tl.classList.add('js');
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) {
      steps.forEach(function (m) { m.classList.add('lit'); }); /* без анимации — все шаги сразу пройдены */
    } else {
      var fill = document.createElement('span');
      /* вставляем в начало списка, чтобы «Сделка и ключи» оставалась последним шагом для стилей */
      fill.className = 'timeline-fill'; fill.setAttribute('aria-hidden', 'true'); tl.insertBefore(fill, tl.firstChild);
      var wide = matchMedia('(min-width: 1101px)'), ticking = false;
      var update = function () {
        ticking = false;
        var vh = window.innerHeight;
        if (wide.matches) {
          /* шаги в одну строку: прогресс зависит от того, насколько блок поднялся по экрану */
          var top = tl.getBoundingClientRect().top;
          var p = Math.min(1, Math.max(0, (vh * 0.85 - top) / (vh * 0.45)));
          /* кружки стоят по центру шага — линия идёт от центра первого до центра последнего */
          var mid = function (m) { return m.offsetLeft + m.offsetWidth / 2; };
          var x0 = mid(steps[0]), x1 = mid(steps[steps.length - 1]);
          fill.style.left = x0 + 'px'; fill.style.width = (p * (x1 - x0)) + 'px';
          steps.forEach(function (m, i) { m.classList.toggle('lit', p > 0 && p >= i / (steps.length - 1) - 0.01); });
        } else {
          /* шаги столбиком или в две строки: шаг загорается, когда доходит до середины экрана */
          steps.forEach(function (m) { m.classList.toggle('lit', m.querySelector('i').getBoundingClientRect().top < vh * 0.62); });
        }
      };
      window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
      window.addEventListener('resize', update);
      update();
    }
  }

  /* Демо-формы: ничего не отправляют, показывают ответ */
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f.hasAttribute('data-demo')) return;
    e.preventDefault();
    /* «Перезвоню в выбранное время» — только там, где время выбирают; Ирина отвечает в течение часа (13.11) */
    var callText = f.querySelector('[name="time"]') ? 'Спасибо! Отвечу в течение часа, перезвоню в выбранное вами время.' : 'Спасибо! Перезвоню или напишу в течение часа.';
    f.innerHTML = '<div class="form-ok">' + T(callText) +
      '<small class="form-ok-demo">' + T('Это прототип: заявка никуда не отправлена.') + '</small></div>';
  });

  /* Квиз «План сделки за 1 минуту» */
  var Q = [
    { key: 'goal', title: 'Что нужно сделать?', opts: [
      ['buy', 'Купить квартиру'],
      ['newbuild', 'Купить в новостройке'],
      ['sell', 'Продать квартиру'],
      ['swap', 'Продать и купить — обмен'],
      ['check', 'Проверить квартиру, которую нашёл сам']
    ] },
    { key: 'where', title: 'Где находится квартира?', opts: [
      ['nsk', 'В Новосибирске, я тоже здесь'],
      ['nsk-far', 'В Новосибирске, а я в другом городе'],
      ['other', 'В другом городе России'],
      ['unknown', 'Пока не решили']
    ] },
    { key: 'pay', title: 'Как планируете расчёт?', opts: [
      ['cash', 'Собственные деньги'],
      ['mortgage', 'Ипотека'],
      ['cert', 'Маткапитал, сертификат, субсидия'],
      ['own', 'Из продажи своей квартиры']
    ] },
    { key: 'when', title: 'Когда хотите выйти на сделку?', opts: [
      ['month', 'В течение месяца'],
      ['q', 'За 1–3 месяца'],
      ['later', 'Пока присматриваюсь']
    ] }
  ];
  var A = {}, step = 0;
  var body = document.getElementById('qBody'), bar = document.getElementById('qBar');
  if (!body) return;

  function render(focus) {
    bar.style.width = (step / Q.length * 100) + '%';
    if (step >= Q.length) return result();
    var q = Q[step];
    var h = '<div class="q-label">Вопрос ' + (step + 1) + ' из ' + Q.length + '</div><div class="q-title">' + T(q.title) + '</div><div class="q-opts">';
    q.opts.forEach(function (o) {
      h += '<button type="button" class="q-opt" data-v="' + o[0] + '">' + T(o[1]) + '</button>';
    });
    h += '</div>';
    if (step > 0) h += '<button type="button" class="q-back">← Назад</button>';
    body.innerHTML = h;
    if (focus) { var b = body.querySelector('.q-opt'); if (b) b.focus({ preventScroll: true }); }
  }

  function plan() {
    var p = ['Бесплатная консультация: разбираю вашу ситуацию и называю риски'];
    if (A.goal === 'sell' || A.goal === 'swap') p.push('Оценка по реальным сделкам рядом, подготовка квартиры, фото и объявления');
    if (A.goal === 'buy' || A.goal === 'swap') p.push('Подбор вариантов под бюджет и отсев «проблемных» квартир до показа');
    if (A.goal === 'check') p.push('Запрашиваю документы у продавца и проверяю историю квартиры');
    if (A.goal === 'newbuild') p.push('Анализ рынка и новостроек под ваш бюджет, оценка надёжности застройщика');
    if (A.where === 'nsk-far' || A.where === 'other') p.push('Показы по видео в прямом эфире — без вашего приезда');
    if (A.pay === 'mortgage') p.push('Подача в несколько банков, одобрение квартиры банком');
    if (A.pay === 'cert') p.push('Документы по сертификату, маткапиталу или субсидии, доли детей');
    if (A.pay === 'own' || A.goal === 'swap') p.push('Обе сделки в одну цепочку, чтобы не остаться без жилья');
    if (A.goal === 'newbuild') p.push('Снижаю цену обязательных сопутствующих услуг: страховок, комиссий, «коробок» банка');
    else p.push('Проверка юридической чистоты и продавца до задатка');
    if (A.where === 'nsk-far' || A.where === 'other') p.push('Подписание без приезда и электронная регистрация, расчёт через защищённый счёт');
    else p.push('Сделка в банке или у нотариуса, безопасный расчёт, ключи и акт');
    return p;
  }

  function result() {
    var term = { month: 'Месяц — реально, если с документами всё чисто. Проверю это на консультации.', q: 'Нормальный срок: хватит времени на выбор и торг.', later: 'Отлично — начнём с консультации, без спешки.' }[A.when];
    var h = '<div class="q-result"><div class="q-label">Ваш план</div><h3>' + T('Вот как пройдёт ваша сделка') + '</h3><p>' + T(term) + '</p><ol class="q-plan">';
    plan().forEach(function (s, i) { h += '<li><b>' + (i + 1) + '</b><span>' + T(s) + '</span></li>'; });
    /* Цены от Ирины 13.11; обмен — уточняем, пока без цифры */
    var price = {
      newbuild: 'Для вас это бесплатно — если вы пришли ко мне до того, как обращались к застройщикам сами.',
      buy: 'Стоимость — от 2% от цены квартиры, оплата только после сделки. Точную сумму назову на бесплатной консультации.',
      sell: 'Стоимость — 2% + 29 000 ₽, оплата только после сделки.',
      check: 'Юрпроверка и сопровождение сделки — 65 000 ₽.'
    }[A.goal] || 'Точную сумму назову на бесплатной консультации: она зависит от цены квартир и сложности сделки. На вторичном рынке — оплата только после сделки.';
    h += '</ol><p>' + T(price) + '</p>' +
      '<form class="q-form" data-demo><label>Имя, если хотите<input type="text" name="name" placeholder="Как к вам обращаться" autocomplete="name"></label>' +
      '<label>Телефон или Telegram *<input type="text" name="contact" placeholder="+7 или @ник" required minlength="5"></label>' +
      '<button class="btn light" type="submit">Прислать этот план ↗</button>' +
      '<div class="consents">' +
      '<label class="consent"><input type="checkbox" name="consent" required><span>' + T('Даю') + ' <a href="' + DOCS + 'soglasie.html" target="_blank">' + T('согласие на обработку персональных данных') + '</a></span></label>' +
      '<label class="consent"><input type="checkbox" name="policy" required><span>' + T('Ознакомлен(а) с') + ' <a href="' + DOCS + 'politika.html" target="_blank">' + T('политикой обработки персональных данных') + '</a></span></label>' +
      '</div></form>' +
      '<button type="button" class="q-back" data-restart>↺ Пройти заново</button></div>';
    body.innerHTML = h;
  }

  body.addEventListener('click', function (e) {
    var opt = e.target.closest('.q-opt'), back = e.target.closest('.q-back');
    if (opt) {
      A[Q[step].key] = opt.getAttribute('data-v'); step++;
      while (step < Q.length && A[Q[step].key]) step++; /* пропускаем вопросы, на которые уже ответили заранее */
      render(true);
    }
    else if (back) { if (back.hasAttribute('data-restart')) { A = {}; step = 0; } else step--; render(true); }
  });

  /* Карточки услуг и линия городов заранее отвечают на вопросы квиза.
     Слушаем весь документ: кнопка в подсказке города появляется позже */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-goal]');
    if (!el) return;
    var g = el.getAttribute('data-goal');
    A = {}; step = 1;
    if (g === 'remote') { A.goal = 'buy'; A.where = 'other'; step = 2; }
    else if (g === 'city') { A.where = 'other'; step = 0; }
    else if (g === 'mortgage') { A.goal = 'buy'; }
    else if (g === 'newbuild') { A.goal = 'newbuild'; }
    else A.goal = g;
    render();
  });

  render();
})();
