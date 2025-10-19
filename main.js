import { Game } from './modules/game.js';

document.addEventListener('DOMContentLoaded', () => {

  const gridElement = document.getElementById('game-grid');
  const uiPanel = document.getElementById('ui-panel');
  const harvestCounterElement = document.getElementById('harvest-counter');
  const muteToggle = document.getElementById('mute-toggle');
  const bgMusic = document.getElementById('bg-music');

  // НАСТРОЙКИ ИГРЫ
  const gridWidth = 30;
  const gridHeight = 20;
  const cellSize = 50;
  // -----------------------

  // Создание и инициализация игры
  const game = new Game(gridElement, harvestCounterElement, gridWidth, gridHeight, cellSize);
  game.init();

  // 1. Обработчик кликов на панели инструментов
  uiPanel.addEventListener('click', (event) => {
    // Ищем ближайший элемент с классом .tool
    const toolButton = event.target.closest('.tool');

    if (toolButton) {
      // Снимаем выделение со всех предыдущих инструментов
      uiPanel.querySelectorAll('.tool').forEach(btn => {
        btn.classList.remove('selected');
      });

      toolButton.classList.add('selected');
      game.activeTool = toolButton.dataset.tool;
    }
  });

  // 2. Обработчик кликов на самой сетке (должен работать)
  gridElement.addEventListener('click', (event) => {
    const cellElement = event.target.closest('.cell');
    // Если мы кликнули на саму картинку растения, closest('.cell') все равно сработает
    if (cellElement) {
      const x = parseInt(cellElement.dataset.x, 10);
      const y = parseInt(cellElement.dataset.y, 10);
      game.handleCellClick(x, y);
    }
  });

  // 3. Обработчик кнопки Mute
  muteToggle.addEventListener('click', () => {
    bgMusic.muted = !bgMusic.muted;
    muteToggle.classList.toggle('muted', bgMusic.muted);
  });

  // 4. Запуск музыки по первому клику
  let musicStarted = false;
  document.body.addEventListener('click', () => {
    if (!musicStarted && bgMusic.src) {
      bgMusic.muted = false;
      bgMusic.play().catch(e => console.warn("Не удалось начать воспроизведение музыки:", e));
      musicStarted = true;
      muteToggle.classList.remove('muted');
    }
  }, { once: true });

});
