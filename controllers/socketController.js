const gameController = require("./gameController");

const socketController = (io) => {
  gameController.init();
  io.on("connection", (socket) => {
    gameController.playerJoin("Player", socket.id, socket.id);
    socket.on("playerMove", (data) => {
      const isDead = gameController.playerMove(socket.id, data);
      const player = gameController.getPlayer(socket.id);
      const visibleArea = gameController.getVisibleAreaForPlayer(
        player,
        isDead
      );
      socket.emit("visibleArea", visibleArea, socket.id);
    });
    socket.on("setUserToPlayer", (userId) => {
      gameController.setUserToPlayer(socket.id, userId);
    });
    socket.on("disconnect", () => {
      gameController.playerLeave(socket.id);
    });
  });
};

module.exports = socketController;
