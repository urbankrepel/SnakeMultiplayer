const gameController = require("./gameController");

const socketController = (io) => {
  gameController.init();
  io.on("connection", (socket) => {
    // on join room
    socket.on("joinRoom", (room) => {
      if (room === "gameRoom") {
        socket.join(room);
        gameController.playerJoin("Player", socket.id, socket.id);
      } else if (room === "viewerRoom") {
        socket.join(room);
        socket.emit("wholeWorld", gameController.getWholeWorld(), socket.id);
      }
    });
    socket.on("playerMove", (data) => {
      const isDead = gameController.playerMove(socket.id, data);
      const player = gameController.getPlayer(socket.id);
      const visibleArea = gameController.getVisibleAreaForPlayer(
        player,
        isDead,
        data.width,
        data.height
      );
      socket.emit("visibleArea", visibleArea, socket.id);
      socket
        .to("viewerRoom")
        .emit("wholeWorld", gameController.getWholeWorld());
    });
    socket.on("setUserToPlayer", (userId) => {
      gameController.setUserToPlayer(socket.id, userId);
    });
    socket.on("disconnect", async () => {
      await gameController.playerLeave(socket.id);
      socket
        .to("viewerRoom")
        .emit("wholeWorld", gameController.getWholeWorld());
    });
  });
};

module.exports = socketController;
