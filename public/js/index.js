let socket;
let direction = "right";
let deadCountdown = 20;

let otherSnakeHeadAsset;
let otherSnakeDeadHeadAsset;
let otherSnakeBodyAsset;
let foodAsset;
let borderHorizontalAsset;
let borderVerticalAsset;

let frameMove = 0;

function preload() {
  otherSnakeHeadAsset = loadImage("/images/snake_yellow_head_32.png");
  otherSnakeDeadHeadAsset = loadImage("/images/snake_yellow_xx_32.png");
  otherSnakeBodyAsset = loadImage("/images/snake_yellow_blob_32.png");
  foodAsset = loadImage("/images/apple_alt_32.png");
  borderHorizontalAsset = loadImage("/images/wall_block_32_2.png");
  borderVerticalAsset = loadImage("/images/wall_block_32_5.png");
}

function setup() {
  createCanvas(1000, 1000).parent("game-container");
  // connect canvas to div
  background(0);

  socketConnect();
}

function draw() {}

function socketConnect() {
  socket = io.connect("http://localhost:3000");

  socket.on("connect", () => {
    socket.emit("joinRoom", "viewerRoom");
  });

  socket.on("wholeWorld", (wholeWorld) => {
    renderWholeWorld(wholeWorld);
  });
}

renderWholeWorld = (wholeWorld) => {
  // Render the background
  background(0);
  const offset = { x: 0, y: 0 };
  const WORLD_SIZE = 1000;
  const viewSize = WORLD_SIZE;

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
  const players = wholeWorld.players;
  const food = wholeWorld.food;
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    for (let j = 1; j < player.body.length; j++) {
      const bodyPart = player.body[j];
      image(
        otherSnakeBodyAsset,
        bodyPart.x - offset.x,
        bodyPart.y - offset.y,
        20,
        20
      );
    }
    if (player.isDead) {
      image(
        otherSnakeDeadHeadAsset,
        player.x - offset.x,
        player.y - offset.y,
        20,
        20
      );
    } else {
      image(
        otherSnakeHeadAsset,
        player.x - offset.x,
        player.y - offset.y,
        20,
        20
      );
    }
  }

  for (let i = 0; i < food.length; i++) {
    const foodItem = food[i];
    image(foodAsset, foodItem.x - offset.x, foodItem.y - offset.y, 10, 10);
  }

  //   Show Leaderboard
  document.getElementById("leaderboard").innerHTML = "";
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const userTemplate = document
      .getElementById("user-template")
      .cloneNode(true).content;
    userTemplate.querySelector("#username").innerText = player.name;
    userTemplate.querySelector("#userscore").innerText = player.score;
    document.getElementById("leaderboard").appendChild(userTemplate);
  }
};
