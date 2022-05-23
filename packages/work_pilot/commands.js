let spawnsInfo = require("./settings/spawns.json");

const STATUS_NONE = 0;
const STATUS_TAKEOFF = 1;
const STATUS_FLIGHT = 2;
const STATUS_LANDING = 3;

const MARKER_DEFAULT = 7;
const MARKER_SKY = 6;

let countPos = 1;

function getRandomNumber(start, end) {
    return start + Math.floor(Math.random() * (end - start + 1));
}

function getRandomElement(array) {
    let index = getRandomNumber(0, array.length - 1);
    return array[index];
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

function setPlayerPoint(player, point, typeMarker) {
    player.call("setPoint", [getPositionFromString(point), typeMarker]);
}

function setPlayerRandomPoint(player, array, typeMarker) {
    let point = getRandomElement(array);

    setPlayerPoint(player, point, typeMarker);
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

    player.pilot = {};
    player.pilot.active = true;
    player.pilot.status = STATUS_TAKEOFF;

    let spawnsKeys = Object.keys(spawnsInfo);
    let indexDepartureAirport = getRandomNumber(0, spawnsKeys.length - 1);

    player.pilot.key_departure = spawnsKeys[indexDepartureAirport];
    player.pilot.data_departure = spawnsInfo[player.pilot.key_departure];

    spawnsKeys.splice(indexDepartureAirport, 1);
    let indexArriveAirport = getRandomNumber(0, spawnsKeys.length - 1);

    player.pilot.key_arrive = spawnsKeys[indexArriveAirport];
    player.pilot.data_arrive = spawnsInfo[player.pilot.key_arrive];

    console.log(indexArriveAirport, player.pilot.key_arrive, spawnsKeys.length);
    
    let spawnData = getRandomElement(player.pilot.data_departure["spawns"]);
    let spawnPosition = getPositionFromString(spawnData);
    let spawnHeading = getHeadingFromString(spawnData);

    let vehicle = mp.vehicles.new(mp.joaat(vehicleName), spawnPosition, {
        heading: spawnHeading,
        engine: true
    });

    player.position = spawnPosition;

    setTimeout(() => {
        player.putIntoVehicle(vehicle, 0);

        player.outputChatBox(`Отправление: ${player.pilot.data_departure["name"]}`);
        player.outputChatBox(`Прибытие: ${player.pilot.data_arrive["name"]}`);

        setPlayerRandomPoint(player, player.pilot.data_departure["departure"], MARKER_SKY);
    }, 200);
})

mp.events.add("playerReachPoint", (player) => {
    switch(player.pilot.status) {
        case STATUS_TAKEOFF:
            setPlayerRandomPoint(player, player.pilot.data_arrive["arrive"], MARKER_SKY);
            player.pilot.status = STATUS_LANDING;
            break;
        case STATUS_LANDING:
            setPlayerRandomPoint(player, player.pilot.data_arrive["spawns"], MARKER_DEFAULT);
            player.pilot.status = STATUS_NONE;
            break;
    }
})