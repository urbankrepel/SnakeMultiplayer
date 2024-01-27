class Snake {
  constructor() {
    this.size = 20;
    this.length = 2; // Length of the snake
    this.body = [
      [0, 0],
      [1, 1],
    ]; // Body positions (relative to the world)
  }

  grow() {
    this.length++;
  }

  display() {
    fill(255);
    noStroke();
    for (let i = 0; i < this.length; i++) {
      let pos = this.body[i];
      rect(pos[0], pos[1], this.size, this.size);
    }
  }

  // Additional methods for growth and collision
}
