let socket;
let direction = "right";
let deadCountdown = 20;

let snakeHeadAsset;
let snakeDeadHeadAsset;
let snakeBodyAsset;
let otherSnakeHeadAsset;
let otherSnakeDeadHeadAsset;
let otherSnakeBodyAsset;
let foodAsset;
let borderHorizontalAsset;
let borderVerticalAsset;
let crownAsset;

let eatSound;
let dieSound;

let frameMove = 0;

let lerpAmount = 0.2; // Control smoothness of the snake movement
let foodAnimationProgress = {}; // Track animation progress for each food item
let foodAnimationSpeed = 0.05; // Control speed of food appearance
let fadeAmount = 255; // Start fully visible for death animation
let fadeSpeed = 10; // Control speed of fade out on death

function preload() {
  snakeHeadAsset = loadImage("/images/snake_green_head_32.png");
  snakeDeadHeadAsset = loadImage("/images/snake_green_xx_32.png");
  snakeBodyAsset = loadImage("/images/snake_green_blob_32.png");
  otherSnakeHeadAsset = loadImage("/images/snake_yellow_head_32.png");
  otherSnakeDeadHeadAsset = loadImage("/images/snake_yellow_xx_32.png");
  otherSnakeBodyAsset = loadImage("/images/snake_yellow_blob_32.png");
  foodAsset = loadImage("/images/apple_alt_32.png");
  borderHorizontalAsset = loadImage("/images/wall_block_32_2.png");
  borderVerticalAsset = loadImage("/images/wall_block_32_5.png");
  eatSound = loadSound("/sounds/eat.mp3");
  dieSound = loadSound("/sounds/die.mp3");
  crownAsset = loadImage("/images/crown.png");
}

let userScale = 2;

function setup() {
  createCanvas(1000, 1000).parent("game-container");
  background(0);
  scale(scale);
  textFont("Press Start 2P");

  socketConnect();

  document.getElementById("up-button").addEventListener("click", () => {
    direction = "up";
  });

  document.getElementById("down-button").addEventListener("click", () => {
    direction = "down";
  });

  document.getElementById("left-button").addEventListener("click", () => {
    direction = "left";
  });

  document.getElementById("right-button").addEventListener("click", () => {
    direction = "right";
  });
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
    move(direction, windowWidth / userScale, windowHeight / userScale);
    frameMove = 5;
  }
  scale(userScale);
  frameMove--;
}

function move(direction, width, height) {
  socket.emit("playerMove", {
    direction: direction,
    width: width,
    height: height,
  });
}

function socketConnect() {
  const userId = document.getElementById("userId").value;
  socket = io.connect("http://localhost:3000");

  socket.on("connect", () => {
    socket.emit("joinRoom", "gameRoom");
    socket.emit("setUserToPlayer", userId);
  });

  socket.on("visibleArea", (visibleArea, socketId) => {
    renderVisibleArea(visibleArea);
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Redraw the canvas content if necessary
}

renderVisibleArea = (visibleArea) => {
  textFont("Press Start 2P");
  // Render the background
  resizeCanvas(windowWidth, windowHeight);
  background(0);
  // change
  const offset = visibleArea.offset;
  const WORLD_SIZE = 1000;
  const viewSize = {
    width: windowWidth / userScale, // Changed to windowWidth
    height: windowHeight / userScale, // Changed to windowHeight
  };
  const topPlayerUsername = visibleArea.topPlayerUsername;
  //Render border
  fill(255);
  if (offset.x < 0) {
    const x = 0;
    const y = 0;
    const w = 20;
    let h = viewSize.height; // Changed to viewSize.height
    if (viewSize.height > WORLD_SIZE - offset.y) {
      // Adjusted to viewSize.height
      h = WORLD_SIZE - offset.y + 20;
    }
    image(borderVerticalAsset, x, y, w, h);
  }
  if (offset.y < 0) {
    const x = 0;
    const y = 0;
    let w = viewSize.width; // Changed to viewSize.width
    const h = 20;
    if (viewSize.width > WORLD_SIZE - offset.x) {
      // Adjusted to viewSize.width
      w = WORLD_SIZE - offset.x + 20;
    }
    image(borderHorizontalAsset, x, y, w, h);
  }
  if (offset.x + viewSize.width >= WORLD_SIZE) {
    // Adjusted to viewSize.width
    const x = WORLD_SIZE - offset.x + 20;
    const y = 0;
    const w = 20;
    let h = viewSize.height; // Changed to viewSize.height
    if (viewSize.height > WORLD_SIZE - offset.y) {
      // Adjusted to viewSize.height
      h = WORLD_SIZE - offset.y + 20;
    }
    image(borderVerticalAsset, x, y, w, h);
  }
  if (offset.y + viewSize.height > WORLD_SIZE) {
    // Adjusted to viewSize.height
    const x = 0;
    const y = WORLD_SIZE - offset.y + 20;
    let w = viewSize.width; // Changed to viewSize.width
    const h = 20;
    if (viewSize.width > WORLD_SIZE - offset.x) {
      // Adjusted to viewSize.width
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
          let headAsset = object.isDead
            ? otherSnakeDeadHeadAsset
            : otherSnakeHeadAsset;
          image(headAsset, pos.x - offset.x, pos.y - offset.y, 20, 20);
          // text under the head
          fill(255);
          textFont("Press Start 2P");
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
      if (object.username === topPlayerUsername) {
        image(
          crownAsset,
          object.body[0].x - offset.x,
          object.body[0].y - offset.y - 20,
          20,
          20
        );
      }
    } else if (object.type === "food") {
      fill(0, 255, 0);
      // ellipse(object.x - offset.x, object.y - offset.y, 5, 5);
      image(foodAsset, object.x - offset.x, object.y - offset.y, 10, 10);
    }
  }
  const player = visibleArea.playerPosition;
  if (player.isDead) {
    fill(255);
    textFont("Press Start 2P");
    text("You are dead", viewSize.width / 2 - 50, viewSize.height / 2); // Centered using viewSize.width and viewSize.height
    if (deadCountdown === 20) {
      dieSound.play();
    }
    const fadeAmount = map(deadCountdown, 20, 0, 255, 0);
    tint(255, fadeAmount);
    deadCountdown--;
    if (deadCountdown <= 0) {
      window.location.href = "/home";
    }
  }
  // Render the player
  fill(255);
  for (let i = player.length - 1; i >= 0; i--) {
    const pos = player.body[i];
    if (i === 0) {
      let headAsset = player.isDead ? snakeDeadHeadAsset : snakeHeadAsset;
      image(headAsset, pos.x - offset.x, pos.y - offset.y, 20, 20);
      // text under the head
      fill(255);
      textFont("Press Start 2P");
      text(player.username, pos.x - offset.x, pos.y - offset.y + 35);
    } else {
      image(snakeBodyAsset, pos.x - offset.x, pos.y - offset.y, 20, 20);
    }
  }
  tint(255, 255);

  if (player.username === topPlayerUsername) {
    image(
      crownAsset,
      player.body[0].x - offset.x,
      player.body[0].y - offset.y - 20,
      20,
      20
    );
  }

  // The rest of the rendering for objects and players remains largely unchanged.
  // Just ensure any reference to positioning or sizing that might have implicitly relied on viewSize being uniform/square is reconsidered.
  if (player.score) {
    fill(255);
    textFont("Press Start 2P");
    text("Score: " + player.score, viewSize.width - 100, 50);
  }

  if (player.eat) {
    eatSound.play();
  }
};
