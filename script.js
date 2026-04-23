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
