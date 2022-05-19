count = 1

mp.events.add("pos", (player) => {
    let pos = player.position;
    let heading = player.heading;

    console.log(`${count}. Position: ${pos} | Heading: ${heading}`);

    count++;
});