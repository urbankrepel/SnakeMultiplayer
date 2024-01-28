let socket;
let direction = "right";

let frameMove = 0;

function setup() {
  createCanvas(1000, 1000);
  background(0);
  scale(2);

  socketConnect();
}

function draw() {
  if (keyIsDown(LEFT_ARROW)) {
    direction = "left";
  } else if (keyIsDown(RIGHT_ARROW)) {
    direction = "right";
  } else if (keyIsDown(UP_ARROW)) {
    direction = "up";
  } else if (keyIsDown(DOWN_ARROW)) {
    direction = "down";
  }
  if (frameMove <= 0) {
    move(direction);
    frameMove = 10;
  }
  scale(2);
  frameMove--;
}

function move(direction) {
  socket.emit("playerMove", { direction: direction });
}

function socketConnect() {
  socket = io.connect("http://localhost:3000");

  socket.on("connect", () => {
    console.log("Connected");
  });

  socket.on("visibleArea", (visibleArea, socketId) => {
    renderVisibleArea(visibleArea);
  });
}

renderVisibleArea = (visibleArea) => {
  // Render the background
  background(0);
  const offset = visibleArea.offset;
  // Render the player
  fill(255);
  const player = visibleArea.playerPosition;
  for (let i = 0; i < player.length; i++) {
    if (i === 0) {
      fill(0, 0, 255);
    } else {
      fill(255, 0, 0);
    }
    const pos = player.body[i];
    ellipse(pos.x - offset.x, pos.y - offset.y, 20, 20);
  }

  // Render the objects
  const objects = visibleArea.objects;
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    if (object.type === "player") {
      fill(255, 0, 0);
      for (let j = 0; j < object.length; j++) {
        const pos = object.body[j];
        ellipse(pos.x - offset.x, pos.y - offset.y, 20, 20);
      }
    } else if (object.type === "food") {
      fill(0, 255, 0);
      ellipse(object.x - offset.x, object.y - offset.y, 5, 5);
    }
  }
};
