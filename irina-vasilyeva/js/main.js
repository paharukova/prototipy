(function () {
  var T = window.typo || function (s) { return s; };

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

  /* Появление блоков при прокрутке */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } });
  }, { threshold: 0.12 }) : null;
  document.querySelectorAll('.reveal').forEach(function (el) { io ? io.observe(el) : el.classList.add('on'); });

  /* Демо-формы: ничего не отправляют, показывают ответ */
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f.hasAttribute('data-demo')) return;
    e.preventDefault();
    f.innerHTML = '<div class="form-ok">' + T('Спасибо! В готовом сайте заявка сразу придёт Ирине, и она свяжется с вами. Сейчас это демонстрация — ничего не отправлено.') + '</div>';
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
    var p = ['Бесплатная консультация 30 минут: разбираю вашу ситуацию и называю риски'];
    if (A.goal === 'sell' || A.goal === 'swap') p.push('Оценка по реальным сделкам рядом, подготовка квартиры, фото и объявления');
    if (A.goal === 'buy' || A.goal === 'swap') p.push('Подбор вариантов под бюджет и отсев «проблемных» квартир до показа');
    if (A.goal === 'check') p.push('Запрашиваю документы у продавца и проверяю историю квартиры');
    if (A.goal === 'newbuild') p.push('Анализ рынка и новостроек под ваш бюджет, оценка надёжности застройщика');
    if (A.where === 'nsk-far' || A.where === 'other') p.push('Показы по видео в прямом эфире — вы видите квартиру моими глазами');
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
    var term = { month: 'Можно успеть за месяц, если начать на этой неделе.', q: 'Нормальный срок: хватит времени на выбор и торг.', later: 'Отлично — начнём с консультации, без спешки.' }[A.when];
    var h = '<div class="q-result"><div class="q-label">Ваш план</div><h3>' + T('Вот как пройдёт ваша сделка') + '</h3><p>' + T(term) + '</p><ol class="q-plan">';
    plan().forEach(function (s, i) { h += '<li><b>' + (i + 1) + '</b><span>' + T(s) + '</span></li>'; });
    var price = A.goal === 'newbuild' ? 'Для вас это бесплатно — 0 ₽.' :
      'Классический вариант — от 2% стоимости объекта, точную сумму для вашего случая пришлю вместе с планом.' + (A.goal === 'sell' || A.goal === 'swap' || A.goal === 'buy' ? ' На вторичном рынке — оплата только после сделки.' : '');
    h += '</ol><p>' + T(price) + '</p>' +
      '<form class="q-form" data-demo><label>Имя<input type="text" name="name" placeholder="Как к вам обращаться" autocomplete="name"></label>' +
      '<label>Телефон или Telegram<input type="text" name="contact" placeholder="+7 или @ник"></label>' +
      '<button class="btn light" type="submit">Прислать план ↗</button>' +
      '<label class="consent"><input type="checkbox" name="consent" required><span>' + T('Даю') + ' <a href="soglasie.html" target="_blank">' + T('согласие на обработку персональных данных') + '</a> ' + T('и принимаю') + ' <a href="politika.html" target="_blank">' + T('политику обработки персональных данных') + '</a></span></label></form>' +
      '<button type="button" class="q-back" data-restart>↺ Пройти заново</button></div>';
    body.innerHTML = h;
  }

  body.addEventListener('click', function (e) {
    var opt = e.target.closest('.q-opt'), back = e.target.closest('.q-back');
    if (opt) { A[Q[step].key] = opt.getAttribute('data-v'); step++; render(true); }
    else if (back) { if (back.hasAttribute('data-restart')) { A = {}; step = 0; } else step--; render(true); }
  });

  /* Карточки услуг заранее отвечают на первый вопрос квиза */
  document.querySelectorAll('[data-goal]').forEach(function (el) {
    el.addEventListener('click', function () {
      var g = el.getAttribute('data-goal');
      A = {}; step = 1;
      if (g === 'remote') { A.goal = 'buy'; A.where = 'other'; step = 2; }
      else if (g === 'mortgage') { A.goal = 'buy'; }
      else if (g === 'newbuild') { A.goal = 'newbuild'; }
      else A.goal = g;
      render();
    });
  });

  render();
})();
