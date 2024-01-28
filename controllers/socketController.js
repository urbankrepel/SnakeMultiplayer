const gameController = require("./gameController");

const socketController = (io) => {
  gameController.init();
  io.on("connection", (socket) => {
    gameController.playerJoin("Player", socket.id, socket.id);
    socket.on("playerMove", (data) => {
      gameController.playerMove(socket.id, data);
      // send to this player new visible area
      const player = gameController.getPlayer(socket.id);
      const visibleArea = gameController.getVisibleAreaForPlayer(player);
      socket.emit("visibleArea", visibleArea, socket.id);
    });
    socket.on("disconnect", () => {
      gameController.playerLeave(socket.id);
    });
  });
};

module.exports = socketController;
