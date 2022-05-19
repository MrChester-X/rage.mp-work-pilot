let playerLocal = mp.players.local

mp.events.add("onPlaneEnter", (vehicle) => {
    // vehicle.setJetEngineOn(true);
    // vehicle.setEngineOn(true, true, true);

    mp.gui.chat.push("Дошло епт");
});