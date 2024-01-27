let snake;
let worldOffsetX = 0;
let worldOffsetY = 0;

function setup() {
  createCanvas(600, 600);
  snake = new Snake();
}

function draw() {
  background(0);
  //translate(width / 2, height / 2); // Always keep snake in the center
  drawWorld();
  snake.display();
}

function drawWorld() {
  // Draw the world, food, and obstacles here
  // All positions should be offset by worldOffsetX and worldOffsetY
}
