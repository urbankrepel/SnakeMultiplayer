const playerModel = require("../models/playerModel");

const players = [];

exports.playerJoin = (name, socketId, userId) => {
  const player = new playerModel(name, socketId, userId);
  players.push(player);
  return player;
};

exports.playerLeave = (socketId) => {
  const index = players.findIndex((player) => player.socketId === socketId);
  if (index !== -1) {
    return players.splice(index, 1)[0];
  }
};

exports.getPlayers = () => {
  return players;
};

exports.getPlayer = (socketId) => {
  return players.find((player) => player.socketId === socketId);
};

exports.getVisibleAreaForPlayer = (player) => {
  const viewSize = 1000; // Size of the area that the player can see
  const worldSize = 10000; // Total world size

  // Calculate the area bounds based on the player's position
  let minX = Math.max(player.x - viewSize / 2, 0);
  let minY = Math.max(player.y - viewSize / 2, 0);
  let maxX = Math.min(player.x + viewSize / 2, worldSize);
  let maxY = Math.min(player.y + viewSize / 2, worldSize);

  // Get the objects within this area
  let visibleObjects = getObjectsInArea(minX, minY, maxX, maxY);

  return {
    playerPosition: { x: player.x, y: player.y, body: player.body },
    objects: visibleObjects,
  };
};

const getObjectsInArea = (minX, minY, maxX, maxY) => {
  const objects = [];

  // Loop through all players
  for (let i = 0; i < players.length; i++) {
    let player = players[i];

    // Check if the player is within the area bounds
    if (
      player.x >= minX &&
      player.x <= maxX &&
      player.y >= minY &&
      player.y <= maxY
    ) {
      // Add the player to the list of objects
      objects.push({
        id: player.socketId,
        x: player.x,
        y: player.y,
        body: player.body,
        name: player.name,
        score: player.score,
      });
    }
  }

  return objects;
};
