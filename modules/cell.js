
export class Cell {
  constructor(x, y, game) {
    this.x = x;
    this.y = y;
    this.game = game;
    this.plant = null;
    this.domElement = document.createElement('div');
    this.domElement.classList.add('cell');
    this.domElement.dataset.x = x;
    this.domElement.dataset.y = y;
  }

  setPlant(plant) {
    if (this.plant) {
      this.removePlant();
    }
    this.plant = plant;
    this.updateAppearance();
  }

  removePlant() {
    this.plant = null;
    this.updateAppearance();
  }

  updateAppearance() {
    this.domElement.innerHTML = '';
    if (this.plant) {
      this.domElement.innerHTML = this.plant.getAppearance();
    }
  }

  update() {
    if (this.plant) {
      this.plant.grow();
    }
  }
}


export class Earth extends Cell {
  constructor(x, y, game) {
    super(x, y, game);
    this.domElement.classList.add('earth');
    this.humidity = 0;
    this.updateHumidity(); // Сразу считаем влажность
    this.updateAppearance();
  }

  setPlant(plant) {
    // Проверяем, можно ли сажать
    if (plant.isValidHabitat(this.humidity)) {
      super.setPlant(plant);
      return true;
    } else {
      // Если влажность не подходит, растение даже не сажается
      console.log("Растение не может расти здесь.");
      // plant.die() не вызываем, т.к. оно еще не "посажено"
      return false;
    }
  }

  updateHumidity() {
    let totalHumidity = 0;
    const maxDist = 4;

    for (const cell of this.game.grid.flat()) {
      if (cell instanceof Water) {
        const dist = Math.abs(this.x - cell.x) + Math.abs(this.y - cell.y);
        if (dist > 0 && dist <= maxDist) {
          totalHumidity += (1 / dist);
        }
      }
    }

    this.humidity = Math.min(totalHumidity * 0.5, 1.0);

    // Если после обновления влажности растению стало "плохо", оно немедленно погибает (die() вызовет removePlant()).
    if (this.plant && !this.plant.isValidHabitat(this.humidity)) {
      this.plant.die();
    }
  }

  updateAppearance() {
    super.updateAppearance();
    const lightness = 80 - (this.humidity * 50);
    this.domElement.style.backgroundColor = `hsl(45, 60%, ${lightness}%)`;
  }

  update() {
    super.update();
  }
}


export class Water extends Cell {
  constructor(x, y, game) {
    super(x, y, game);
    this.domElement.classList.add('water');
  }

  setPlant(plant) {
    console.log("Нельзя сажать в воду!");
    return false;
  }

  removePlant() {
    // нечего удалять
  }

  updateAppearance() {
    this.domElement.innerHTML = '';
    this.domElement.style.backgroundColor = '';
  }

  update() {
    // Вода ничего не делает
  }
}
