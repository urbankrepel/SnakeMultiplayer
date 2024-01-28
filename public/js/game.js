let socket;
let direction = "right";

let snakeHeadAsset;
let snakeBodyAsset;
let otherSnakeHeadAsset;
let otherSnakeBodyAsset;
let foodAsset;
let borderHorizontalAsset;
let borderVerticalAsset;

let frameMove = 0;

function preload() {
  snakeHeadAsset = loadImage("/images/snake_green_head_32.png");
  snakeBodyAsset = loadImage("/images/snake_green_blob_32.png");
  otherSnakeHeadAsset = loadImage("/images/snake_yellow_head_32.png");
  otherSnakeBodyAsset = loadImage("/images/snake_yellow_blob_32.png");
  foodAsset = loadImage("/images/apple_alt_32.png");
  borderHorizontalAsset = loadImage("/images/wall_block_32_2.png");
  borderVerticalAsset = loadImage("/images/wall_block_32_5.png");
}

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
    frameMove = 5;
  }
  scale(2);
  frameMove--;
}

function move(direction) {
  socket.emit("playerMove", { direction: direction });
}

function socketConnect() {
  const userId = document.getElementById("userId").value;
  socket = io.connect("http://localhost:3000");

  socket.on("connect", () => {
    socket.emit("setUserToPlayer", userId);
  });

  socket.on("visibleArea", (visibleArea, socketId) => {
    renderVisibleArea(visibleArea);
  });
}

renderVisibleArea = (visibleArea) => {
  // Render the background
  background(0);
  const offset = visibleArea.offset;
  const WORLD_SIZE = 1000;
  const viewSize = 500;

  //Render border
  fill(255);
  // console.log(offset);
  if (offset.x < 0) {
    const x = 0;
    const y = 0;
    const w = 20;
    let h = viewSize;
    if (viewSize > WORLD_SIZE - offset.y) {
      h = WORLD_SIZE - offset.y + 20;
    }
    image(borderVerticalAsset, x, y, w, h);
  }
  if (offset.y < 0) {
    const x = 0;
    const y = 0;
    let w = viewSize;
    const h = 20;
    if (viewSize > WORLD_SIZE - offset.x) {
      w = WORLD_SIZE - offset.x + 20;
    }
    image(borderHorizontalAsset, x, y, w, h);
  }
  if (offset.x + viewSize >= WORLD_SIZE) {
    const x = WORLD_SIZE - offset.x + 20;
    const y = 0;
    const w = 20;
    let h = viewSize;
    if (viewSize > WORLD_SIZE - offset.y) {
      h = WORLD_SIZE - offset.y + 20;
    }
    image(borderVerticalAsset, x, y, w, h);
  }
  if (offset.y + viewSize > WORLD_SIZE) {
    const x = 0;
    const y = WORLD_SIZE - offset.y + 20;
    let w = viewSize;
    const h = 20;
    if (viewSize > WORLD_SIZE - offset.x) {
      w = WORLD_SIZE - offset.x + 20;
    }
    image(borderHorizontalAsset, x, y, w, h);
  }

  // Render the objects
  const objects = visibleArea.objects;
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    if (object.type === "player") {
      fill(255, 0, 0);
      for (let j = object.length - 1; j >= 0; j--) {
        const pos = object.body[j];
        if (j === 0) {
          image(
            otherSnakeHeadAsset,
            pos.x - offset.x,
            pos.y - offset.y,
            20,
            20
          );
          // text under the head
          fill(255);
          text(object.username, pos.x - offset.x, pos.y - offset.y + 35);
        } else {
          image(
            otherSnakeBodyAsset,
            pos.x - offset.x,
            pos.y - offset.y,
            20,
            20
          );
        }
      }
    } else if (object.type === "food") {
      fill(0, 255, 0);
      // ellipse(object.x - offset.x, object.y - offset.y, 5, 5);
      image(foodAsset, object.x - offset.x, object.y - offset.y, 10, 10);
    }
  }

  // Render the player
  fill(255);
  const player = visibleArea.playerPosition;
  for (let i = player.length - 1; i >= 0; i--) {
    const pos = player.body[i];
    if (i === 0) {
      image(snakeHeadAsset, pos.x - offset.x, pos.y - offset.y, 20, 20);
      // text under the head
      fill(255);
      text(player.username, pos.x - offset.x, pos.y - offset.y + 35);
    } else {
      image(snakeBodyAsset, pos.x - offset.x, pos.y - offset.y, 20, 20);
    }
  }
};
