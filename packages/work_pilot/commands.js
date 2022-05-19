spawnPlanes = [
    {x: -1441.23095703125, y: -2663.0244140625, z: 0.784507751464844, heading: -119.2569808959961},
    {x: -1475.501220703125, y: -2727.046142578125, z: 0.749717712402344, heading: -119.88446044921875}
]

var countPos = 1

function getRandomNumber(start, end) {
    return start + Math.floor(Math.random() * (end - start - 0.01));
}

mp.events.addCommand("posPlayer", (player) => {
    let pos = player.position;
    let heading = player.heading;

    console.log(`player ${countPos}. {x: ${pos.x}, y: ${pos.y}, z: ${pos.z}, heading: ${heading}}`);

    countPos++;
});

mp.events.addCommand("posVehicle", (player) => {
    let pos = player.vehicle.position;
    let heading = player.vehicle.heading;

    console.log(`vehicle ${countPos}. {x: ${pos.x}, y: ${pos.y}, z: ${pos.z}, heading: ${heading}}`);

    countPos++;
});

mp.events.addCommand("spawn", (player) => {
    let index = getRandomNumber(0, spawnPlanes.length);
    
    player.position = spawnPlanes[index];

    let vehicle = mp.vehicles.new(mp.joaat("jet"), spawnPlanes[index], {
        heading: spawnPlanes[index].heading,
        engine: true
    });

    setTimeout(() => {
        player.call("onPlaneEnter", [vehicle]);

        setTimeout(() => {
            player.putIntoVehicle(vehicle, 0);
            player.outputChatBox(`Вы успешно сели в самолет ${index}`);
        }, 200)
    }, 200);
})