// =============================================
// АНИМАЦИЯ ЧИСЕЛ В STATS-ПОЛОСЕ
// =============================================
// Находит все элементы с атрибутом [data-target] и
// плавно увеличивает число от 0 до целевого значения
// когда элемент попадает в область видимости.
//
// Техника: IntersectionObserver ловит момент появления,
// requestAnimationFrame делает плавную анимацию,
// ease-out даёт эффект «замедления к концу» —
// выглядит как дорогая статистика на корпоративных сайтах.

(function () {
  // Все счётчики на странице
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  // ease-out cubic: быстро в начале, медленно в конце
  // t — прогресс от 0 до 1, возвращает [0..1]
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  // Длительность одной анимации (мс)
  const DURATION = 1800;

  // Анимирует одно число от 0 до целевого
  function animate(el) {
    const target = parseInt(el.dataset.target, 10);
    const startTime = performance.now();

    function tick(now) {
      // Прогресс от 0 до 1
      const progress = Math.min((now - startTime) / DURATION, 1);
      const eased = easeOut(progress);
      el.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        // В конце гарантируем точное значение
        el.textContent = target;
      }
    }

    requestAnimationFrame(tick);
  }

  // Наблюдатель: запускает анимацию, когда счётчик
  // появляется в зоне видимости. Один раз на элемент.
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.4, // когда 40% числа видно — стартуем
  });

  // Подписываем каждый счётчик
  counters.forEach((el) => observer.observe(el));
})();


// =============================================
// МЕНЮ — открытие/закрытие + акордеоны
// =============================================
// Бургер в хедере → открывает fullscreen меню.
// Крестик внутри меню → закрывает.
// При открытии — блокируем скрол body.
// Акордеоны (Продукція/Компанія/Екологія) —
// независимые, каждый открывается кликом.
// Esc — закрывает меню.

(function () {
  const burger = document.querySelector('.header__burger');
  const menu = document.getElementById('menu');
  if (!burger || !menu) return;

  const closeBtn = menu.querySelector('.menu__close');
  const toggles = menu.querySelectorAll('.menu__toggle');

  function openMenu() {
    menu.classList.add('menu--open');
    menu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  function closeMenu() {
    menu.classList.remove('menu--open');
    menu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  burger.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);

  // Акордеон: клик по заголовку раскрывает/сворачивает подсписок.
  // Стрелочка-шеврон крутится через CSS (селектор по aria-expanded).
  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
    });
  });

  // Escape — удобный способ закрыть меню с клавиатуры
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('menu--open')) {
      closeMenu();
    }
  });
})();
