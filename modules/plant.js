
export class Plant {
  constructor(cell, minHumidity, maxHumidity, imagePath, plantType) {
    this.cell = cell;
    this.growth = 1;
    this.maxGrowth = 5;
    this.isDead = false;

    this.minHumidity = minHumidity;
    this.maxHumidity = maxHumidity;

    this.imagePath = imagePath;
    this.type = plantType;
  }

  isValidHabitat(humidity) {
    return humidity >= this.minHumidity && humidity <= this.maxHumidity;
  }

  grow() {
    if (this.isDead || this.growth >= this.maxGrowth) {
      return;
    }

    // Проверка влажности на каждом тике
    if (this.isValidHabitat(this.cell.humidity)) {
      this.growth++;
      this.cell.updateAppearance();
    } else {
      this.die(); // Условия больше не подходят -> гибель
    }
  }


  die() {
    if (this.isDead) return; // Чтобы не вызывать рекурсию

    this.isDead = true;
    console.log(`Растение ${this.type} погибло от неподходящей влажности.`);

    // Немедленно удаляем растение с клетки
    // (cell.removePlant() вызовет updateAppearance() и уберет картинку)
    this.cell.removePlant();
  }

  getAppearance() {
    let growthClass = this.isDead ? 'plant-dead' : `plant-growth-${this.growth}`;
    return `<img src="${this.imagePath}" class="plant-image ${growthClass}" alt="${this.type}">`;
  }
}


export class Potato extends Plant {
  constructor(cell, imagePath) {
    // super(cell, minHumidity, maxHumidity, imagePath, plantType)
    super(cell, 0.3, 0.7, imagePath, 'potato');
  }
}


export class Cactus extends Plant {
  constructor(cell, imagePath) {
    super(cell, 0.0, 0.29, imagePath, 'cactus');
  }
}


export class Swamper extends Plant {
  constructor(cell, imagePath) {
    super(cell, 0.71, 1.0, imagePath, 'swamper');
  }
}
