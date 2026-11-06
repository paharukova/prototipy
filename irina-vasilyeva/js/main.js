(function () {
  var T = window.typo || function (s) { return s; };

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
    f.innerHTML = '<div class="form-ok">' + T('Спасибо! В готовом сайте заявка придёт Ирине в Telegram, и она свяжется с вами. Сейчас это демонстрация — ничего не отправлено.') + '</div>';
  });

  /* Квиз «План сделки» */
  var Q = [
    { key: 'goal', title: 'Что нужно сделать?', opts: [
      ['buy', 'ti-home-search', 'Купить квартиру'],
      ['sell', 'ti-home-dollar', 'Продать квартиру'],
      ['swap', 'ti-arrows-exchange', 'Продать и купить — обмен'],
      ['check', 'ti-shield-check', 'Проверить квартиру, которую нашёл сам']
    ] },
    { key: 'where', title: 'Где находится квартира?', opts: [
      ['nsk', 'ti-map-pin', 'В Новосибирске, я тоже здесь'],
      ['nsk-far', 'ti-plane', 'В Новосибирске, а я в другом городе'],
      ['other', 'ti-map-2', 'В другом городе России'],
      ['unknown', 'ti-help-circle', 'Пока не решили']
    ] },
    { key: 'pay', title: 'Как планируете расчёт?', opts: [
      ['cash', 'ti-wallet', 'Собственные деньги'],
      ['mortgage', 'ti-building-bank', 'Ипотека'],
      ['cert', 'ti-certificate', 'Маткапитал, сертификат, субсидия'],
      ['own', 'ti-home-move', 'Из продажи своей квартиры']
    ] },
    { key: 'when', title: 'Когда хотите выйти на сделку?', opts: [
      ['month', 'ti-bolt', 'В течение месяца'],
      ['q', 'ti-calendar', 'За 1–3 месяца'],
      ['later', 'ti-eye', 'Пока присматриваюсь']
    ] }
  ];
  var A = {}, step = 0;
  var body = document.getElementById('qBody'), bar = document.getElementById('qBar');
  if (!body) return;

  function render() {
    bar.style.width = (step / Q.length * 100) + '%';
    if (step >= Q.length) return result();
    var q = Q[step];
    var h = '<div class="q-step">Вопрос ' + (step + 1) + ' из ' + Q.length + '</div><div class="q-title">' + T(q.title) + '</div><div class="q-opts">';
    q.opts.forEach(function (o) {
      h += '<button type="button" class="q-opt" data-v="' + o[0] + '"><i class="ti ' + o[1] + '"></i>' + T(o[2]) + '</button>';
    });
    h += '</div>';
    if (step > 0) h += '<button type="button" class="q-back">← Назад</button>';
    body.innerHTML = h;
  }

  function plan() {
    var p = ['Бесплатная консультация 30 минут: разбираю вашу ситуацию и называю риски'];
    if (A.goal === 'sell' || A.goal === 'swap') p.push('Оценка по реальным сделкам рядом, подготовка квартиры, фото и объявления');
    if (A.goal === 'buy' || A.goal === 'swap') p.push('Подбор вариантов под бюджет и отсев «проблемных» квартир до показа');
    if (A.goal === 'check') p.push('Запрашиваю документы у продавца и проверяю историю квартиры');
    if (A.where === 'nsk-far' || A.where === 'other') p.push('Показы по видео в прямом эфире — вы видите квартиру моими глазами');
    if (A.pay === 'mortgage') p.push('Подача в несколько банков, одобрение квартиры банком');
    if (A.pay === 'cert') p.push('Документы по сертификату или маткапиталу, доли детей');
    if (A.pay === 'own' || A.goal === 'swap') p.push('Обе сделки в одну цепочку, чтобы не остаться без жилья');
    p.push('Проверка юридической чистоты и продавца до задатка');
    if (A.where === 'nsk-far' || A.where === 'other') p.push('Подписание без приезда и электронная регистрация, расчёт через защищённый счёт');
    else p.push('Сделка в банке или у нотариуса, безопасный расчёт, ключи и акт');
    return p;
  }

  function result() {
    var term = { month: 'Можно успеть за месяц, если начать на этой неделе.', q: 'Нормальный срок: хватит времени на выбор и торг.', later: 'Отлично — начнём с консультации и чек-листа, без спешки.' }[A.when];
    var h = '<div class="q-result"><span class="keytag">ваш план</span><h3>' + T('Вот как пройдёт ваша сделка') + '</h3><p>' + T(term) + '</p><ol class="q-plan">';
    plan().forEach(function (s, i) { h += '<li><b>' + (i + 1) + '</b><span>' + T(s) + '</span></li>'; });
    h += '</ol><p>' + T('Примерную стоимость моей работы для вашего случая пришлю вместе с планом.') + ' <span class="need-tip">цены — нужно от вас</span></p>' +
      '<form class="q-form" data-demo><label>Имя<input type="text" placeholder="Как к вам обращаться"></label>' +
      '<label>Телефон или Telegram<input type="text" placeholder="+7 или @ник"></label>' +
      '<button class="btn btn-main" type="submit">Прислать план</button></form>' +
      '<button type="button" class="q-back" data-restart>↺ Пройти заново</button></div>';
    body.innerHTML = h;
  }

  body.addEventListener('click', function (e) {
    var opt = e.target.closest('.q-opt'), back = e.target.closest('.q-back');
    if (opt) { A[Q[step].key] = opt.getAttribute('data-v'); step++; render(); }
    else if (back) { if (back.hasAttribute('data-restart')) { A = {}; step = 0; } else step--; render(); }
  });

  /* Карточки задач заранее отвечают на первый вопрос квиза */
  document.querySelectorAll('[data-goal]').forEach(function (el) {
    el.addEventListener('click', function () {
      var g = el.getAttribute('data-goal');
      if (el.getAttribute('href') !== '#quiz' && g !== 'remote') return;
      A = {}; step = 0;
      if (g === 'remote') { step = 1; A.goal = 'buy'; }
      else if (['buy', 'sell', 'swap', 'check'].indexOf(g) >= 0) { A.goal = g; step = 1; }
      else if (g === 'mortgage') { A.goal = 'buy'; A.pay = 'mortgage'; step = 1; }
      if (el.getAttribute('href') === '#quiz' || g === 'remote') render();
    });
  });

  render();
})();
