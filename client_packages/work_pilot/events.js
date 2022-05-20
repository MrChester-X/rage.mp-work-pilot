let playerLocal = mp.players.local

mp.events.add("onPlaneEnter", (vehicle) => {
    mp.gui.chat.push("Дошло епт");
});