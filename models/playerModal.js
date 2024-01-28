class PlayerModel {
  constructor(name, socketId, userId) {
    this.name = name;
    this.userId = userId;
    this.socketId = socketId;
    this.score = 0;
    this.x = 0;
    this.y = 0;
    this.body = [];
  }

  updateScore() {
    this.score++;
  }

  move(newX, newY, eat) {
    this.x = newX;
    this.y = newY;

    this.body.unshift({ x: newX, y: newY });
    if (!eat) {
      this.body.pop();
    }
  }
}

module.exports = PlayerModel;
