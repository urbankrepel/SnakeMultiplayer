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
    this.isDead = false;
    this.eat
  }

  updateScore() {
    this.score++;
  }

  move(newX, newY, eat) {
    if (this.isDead) {
      return true;
    }
    if (this.isColliding(gameController.getAlivePlayers(), newX, newY)) {
      this.isDead = true;
      return true;
    }
    if (
      newX < 0 ||
      newY < 0 ||
      newX > gameController.getWorldSize() ||
      newY > gameController.getWorldSize()
    ) {
      this.isDead = true;
      return true;
    }
    this.x = newX;
    this.y = newY;

    this.body.unshift({ x: newX, y: newY });
    if (!eat) {
      this.body.pop();
    } else {
      this.length++;
    }

    return false;
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

  isColliding(otherPlayers, newX, newY) {
    for (let i = 0; i < otherPlayers.length; i++) {
      const player = otherPlayers[i];
      if (player.socketId !== this.socketId) {
        if (
          player.x + player.size / 2 >= newX &&
          player.x - player.size / 2 <= newX &&
          player.y + player.size / 2 >= newY &&
          player.y - player.size / 2 <= newY
        ) {
          return true;
        }
        for (let j = 0; j < player.length; j++) {
          const pos = player.body[j];
          if (
            pos.x + player.size / 2 >= newX &&
            pos.x - player.size / 2 <= newX &&
            pos.y + player.size / 2 >= newY &&
            pos.y - player.size / 2 <= newY
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }
}

module.exports = PlayerModel;
