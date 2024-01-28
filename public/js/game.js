let worldOffsetX = 0;
let worldOffsetY = 0;
let socket;

function setup() {
  createCanvas(1000, 1000);
  background(0);

  socketConnect();
}

function draw() {
  background(0);
}

function socketConnect() {
  socket = io.connect("http://localhost:3000");
}
