spawnPlanes = [
    {x: -1439.4000244140625, y: -2663.916259765625, z: 22.7186222076416, heading: -85.31299591064453}
]

var countPos = 1

mp.events.addCommand("pos", (player) => {
    let pos = player.position;
    let heading = player.heading;

    console.log(`${count}. {x: ${pos.x}, y: ${pos.y}, z: ${pos.z}, heading: ${heading}}`);

    count++;
});