const playerModel = require("../models/playerModel");
const UserModel = require("../models/userModel");

const players = [];
let food = [];

const worldSize = 1000;

exports.getWorldSize = () => {
  return worldSize;
};

exports.init = () => {
  // Generate food
  food = this.generateFood();
};

exports.playerJoin = (name, socketId, userId) => {
  const player = new playerModel(name, socketId, userId);
  const randomLocation = this.randomLocation();
  player.move(randomLocation.x, randomLocation.y, false);

  players.push(player);
  return player;
};

exports.playerLeave = async (socketId) => {
  const index = players.findIndex((player) => player.socketId === socketId);
  if (index === -1) return;
  const user = await UserModel.findById(players[index].userId);
  if (user) {
    if (user.highScore < players[index].score) {
      user.highScore = players[index].score;
    }
    user.coins += Math.floor(players[index].score / 10);
    user.save();
  }
  if (index !== -1) {
    return players.splice(index, 1)[0];
  }
};

exports.getPlayers = () => {
  return players;
};

exports.getAlivePlayers = () => {
  return players.filter((player) => !player.isDead);
};

exports.getPlayer = (socketId) => {
  return players.find((player) => player.socketId === socketId);
};

exports.getWholeWorld = () => {
  return {
    players: players,
    food: food,
  };
};

exports.getVisibleAreaForPlayer = (player, isDead) => {
  const viewSize = 500; // Size of the area that the player can see
  const worldSize = this.getWorldSize(); // Total world size

  // Calculate the area bounds based on the player's position
  let minX = Math.max(player.x - viewSize / 2, -20);
  let minY = Math.max(player.y - viewSize / 2, -20);
  let maxX = Math.min(player.x + viewSize / 2, worldSize);
  let maxY = Math.min(player.y + viewSize / 2, worldSize);

  // Get the objects within this area
  let visibleObjects = getObjectsInArea(minX, minY, maxX, maxY, player);

  return {
    offset: {
      x: minX,
      y: minY,
    },
    playerPosition: {
      username: player.name,
      x: player.x,
      y: player.y,
      body: player.body,
      length: player.length,
      isDead: isDead,
    },
    objects: visibleObjects,
  };
};

const getObjectsInArea = (minX, minY, maxX, maxY, currentPlayer) => {
  const objects = [];

  // Loop through all players and check if they are in the area bounds x,y and body
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    if (player.socketId === currentPlayer.socketId) {
      continue;
    }
    const isVisible = player.isVisible(minX, minY, maxX, maxY);
    if (isVisible) {
      objects.push({
        type: "player",
        username: player.name,
        x: player.x,
        y: player.y,
        body: player.body,
        length: player.length,
        isDead: player.isDead,
      });
    }
  }

  // Loop through all food and check if they are in the area bounds
  for (let i = 0; i < food.length; i++) {
    const foodItem = food[i];
    if (
      foodItem.x >= minX &&
      foodItem.x <= maxX &&
      foodItem.y >= minY &&
      foodItem.y <= maxY
    ) {
      objects.push({
        type: "food",
        x: foodItem.x,
        y: foodItem.y,
      });
    }
  }

  return objects;
};

exports.playerMove = (socketId, data) => {
  const direction = data.direction;
  const player = players.find((player) => player.socketId === socketId);
  const moveDistance = player.size / 2;
  const foodEaten = food.find((foodItem) => {
    return (
      player.x + moveDistance >= foodItem.x &&
      player.x - moveDistance <= foodItem.x &&
      player.y + moveDistance >= foodItem.y &&
      player.y - moveDistance <= foodItem.y
    );
  });
  let eat = false;
  if (foodEaten) {
    player.updateScore();
    food = food.filter((foodItem) => foodItem !== foodEaten);
    eat = true;
  }
  if (direction === "left") {
    return player.move(player.x - moveDistance, player.y, eat);
  } else if (direction === "right") {
    return player.move(player.x + moveDistance, player.y, eat);
  } else if (direction === "up") {
    return player.move(player.x, player.y - moveDistance, eat);
  } else if (direction === "down") {
    return player.move(player.x, player.y + moveDistance, eat);
  }
};

exports.generateFood = () => {
  const food = [];
  for (let i = 0; i < 100; i++) {
    food.push(this.randomLocation());
  }
  return food;
};

exports.setUserToPlayer = async (socketId, userId) => {
  const player = players.find((player) => player.socketId === socketId);
  player.userId = userId;
  const user = await UserModel.findById(userId);
  player.name = user.username;
  return player;
};

exports.randomLocation = () => {
  const x = Math.floor(Math.random() * (worldSize - 30)) + 20;
  const y = Math.floor(Math.random() * (worldSize - 30)) + 20;
  return { x, y };
};
