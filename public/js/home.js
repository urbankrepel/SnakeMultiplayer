function socketConnect() {
  socket = io.connect("http://localhost:3000");

  socket.on("connect", () => {
    socket.emit("joinRoom", "viewerRoom");
  });

  socket.on("wholeWorld", (wholeWorld) => {
    renderWholeWorld(wholeWorld);
  });
}

socketConnect();

renderWholeWorld = (wholeWorld) => {
  //   Show Leaderboard
  const players = wholeWorld.players;
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
