let spawnsInfo = require("./settings/spawns.json");

let countPos = 1;

function getRandomNumber(start, end) {
    return start + Math.floor(Math.random() * (end - start));
}

function getPositionFromString(line) {
    line = line.split(" ");

    return new mp.Vector3(parseFloat(line[0]), parseFloat(line[1]), parseFloat(line[2]));
}

function getRotationFromString(line) {
    line = line.split(" ");

    return new mp.Vector3(parseFloat(line[3]), parseFloat(line[4]), parseFloat(line[5]));
}

function getHeadingFromString(line) {
    line = line.split(" ");

    return parseFloat(line[3]);
}

mp.events.addCommand("posPlayer", (player) => {
    let pos = player.position;
    let heading = player.heading;

    console.log(`player ${countPos}. ${pos.x} ${pos.y} ${pos.z} ${heading}`);

    countPos++;
});

mp.events.addCommand("posVehicle", (player) => {
    let pos = player.vehicle.position;
    let heading = player.vehicle.heading;

    console.log(`vehicle ${countPos}. ${pos.x} ${pos.y} ${pos.z} ${heading}`);

    countPos++;
});

mp.events.addCommand("posRotation", (player) => {
    let pos = player.vehicle.position;
    let rotation = player.vehicle.rotation;

    console.log(`rotation ${countPos}. ${pos.x} ${pos.y} ${pos.z} ${rotation.x} ${rotation.y} ${rotation.z}`);

    countPos++;
});

mp.events.addCommand("start", (player, _, vehicleName) => {
    console.log(spawnsInfo);

    let spawnsKeys = Object.keys(spawnsInfo);
    let indexDepartureAirport = getRandomNumber(0, spawnsKeys.length - 1);

    player.pilot = {};
    player.pilot.key_departure = spawnsKeys[indexDepartureAirport];
    player.pilot.data_departure = spawnsInfo[player.pilot.key_departure];

    console.log(indexDepartureAirport, player.pilot.key_departure, spawnsKeys.length);
    
    let spawns = player.pilot.data_departure["spawns"];
    let indexSpawn = getRandomNumber(0, spawns.length - 1);
    let spawnData = spawns[indexSpawn];

    let spawnPosition = getPositionFromString(spawnData);
    let spawnHeading = getHeadingFromString(spawnData);

    player.position = spawnPosition;

    let vehicle = mp.vehicles.new(mp.joaat(vehicleName), spawnPosition, {
        heading: spawnHeading,
        engine: true
    });

    setTimeout(() => {
        player.call("onPlaneEnter", [vehicle]);

        player.putIntoVehicle(vehicle, 0);
        player.outputChatBox(`Локация: ${player.pilot.data_departure["name"]}`);
    }, 200);
})