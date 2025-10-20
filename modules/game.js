import { Earth, Water } from './cell.js';
import { Potato, Cactus, Swamper } from './plant.js';

export class Game {
  constructor(gridElement, harvestCounterElement, width, height, cellSize) {
    this.gridElement = gridElement;
    this.harvestCounterElement = harvestCounterElement;
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.grid = [];
    this.activeTool = 'shovel';
    this.gameInterval = null;

    this.plantImages = {
      potato: 'images/potato.png',
      cactus: 'images/cactus.png',
      swamper: 'images/swamper.png'
    };

    this.harvestCounts = {
      potato: 0,
      cactus: 0,
      swamper: 0
    };
  }

  init() {
    // Устанавливаем CSS-переменную для размера клеток (для style.css)
    this.gridElement.style.setProperty('--cell-size', `${this.cellSize}px`);

    // Настраиваем CSS-сетку
    this.gridElement.style.gridTemplateColumns = `repeat(${this.width}, ${this.cellSize}px)`;
    this.gridElement.style.gridTemplateRows = `repeat(${this.height}, ${this.cellSize}px)`;

    for (let y = 0; y < this.height; y++) {
      const row = [];
      for (let x = 0; x < this.width; x++) {
        const cell = new Earth(x, y, this);
        row.push(cell);
        this.gridElement.appendChild(cell.domElement);
      }
      this.grid.push(row);
    }

    this.updateAllHumidity();
    this.updateHarvestCounter();
    this.startGameLoop();
  }

  startGameLoop() {
    this.gameInterval = setInterval(() => {
      this.grid.flat().forEach(cell => cell.update());
    }, 2000);
  }

  getCell(x, y) {
    if (this.grid[y] && this.grid[y][x]) {
      return this.grid[y][x];
    }
    return null;
  }

  handleCellClick(x, y) {
    const cell = this.getCell(x, y);
    if (!cell) return;

    switch (this.activeTool) {
      case 'shovel':
        if (cell.plant) {
          if (!cell.plant.isDead && cell.plant.growth >= cell.plant.maxGrowth) {
            this.harvest(cell.plant);
          } else {
            cell.plant.die();
          }
        }
        break;

      case 'waterBucket':
        if (!(cell instanceof Water)) {
          this.replaceCell(x, y, new Water(x, y, this));
        }
        break;

      case 'emptyBucket':
        if (cell instanceof Water) {
          this.replaceCell(x, y, new Earth(x, y, this));
        }
        break;

      case 'potatoSeed':
        if (cell instanceof Earth) {
          cell.setPlant(new Potato(cell, this.plantImages.potato));
        }
        break;

      case 'cactusSeed':
        if (cell instanceof Earth) {
          cell.setPlant(new Cactus(cell, this.plantImages.cactus));
        }
        break;

      case 'swamperSeed':
        if (cell instanceof Earth) {
          cell.setPlant(new Swamper(cell, this.plantImages.swamper));
        }
        break;
    }
  }

  replaceCell(x, y, newCell) {
    const oldCell = this.getCell(x, y);

    // Получаем индекс старого элемента среди всех детей сетки
    const oldIndex = y * this.width + x;
    const nextElement = this.gridElement.children[oldIndex + 1];

    // Удаляем старый DOM-элемент
    this.gridElement.removeChild(oldCell.domElement);

    this.grid[y][x] = newCell;

    // Вставляем новый DOM-элемент на место старого
    // Используем nextElement как reference, чтобы вставить новый элемент ПЕРЕД ним
    this.gridElement.insertBefore(newCell.domElement, nextElement);

    this.updateAllHumidity();
  }

  updateAllHumidity() {
    this.grid.flat().forEach(cell => {
      if (cell instanceof Earth) {
        cell.updateHumidity();
        cell.updateAppearance();
      }
    });
  }

  harvest(plant) {
    if (this.harvestCounts.hasOwnProperty(plant.type)) {
      this.harvestCounts[plant.type]++;
      this.updateHarvestCounter();
    }

    // Убираем растение с поля (die() вызовет removePlant())
    plant.die();
  }

  updateHarvestCounter() {
    this.harvestCounterElement.innerHTML = '<h3>Собрано:</h3>';

    for (const type in this.harvestCounts) {
      const count = this.harvestCounts[type];
      const imagePath = this.plantImages[type];

      const item = document.createElement('div');
      item.classList.add('harvest-item');
      item.innerHTML = `
                <img src="${imagePath}" alt="${type}" class="harvest-icon">
                <span>${count}</span>
            `;
      this.harvestCounterElement.appendChild(item);
    }
  }
}
