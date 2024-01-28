const gameController = require("../controllers/gameController");

class PlayerModel {
  constructor(name, socketId, userId) {
    this.name = name;
    this.userId = userId;
    this.socketId = socketId;
    this.score = 0;
    this.x = 0;
    this.y = 0;
    this.body = [{ x: 0, y: 0 }];
    this.length = 1;
    this.size = 20;
  }

  updateScore() {
    this.score++;
  }

  move(newX, newY, eat) {
    let xDiff = 0;
    let yDiff = 0;
    if (
      newX < 0 ||
      newY < 0 ||
      newX > gameController.getWorldSize() ||
      newY > gameController.getWorldSize()
    ) {
      return;
    }
    this.x = newX;
    this.y = newY;

    this.body.unshift({ x: newX, y: newY });
    if (!eat) {
      this.body.pop();
    } else {
      this.length++;
    }
  }

  isVisible(minX, minY, maxX, maxY) {
    if (this.x >= minX && this.x <= maxX && this.y >= minY && this.y <= maxY) {
      return true;
    }
    for (let i = 0; i < this.body.length; i++) {
      const pos = this.body[i];
      if (pos.x >= minX && pos.x <= maxX && pos.y >= minY && pos.y <= maxY) {
        return true;
      }
    }
    return false;
  }
}

module.exports = PlayerModel;
