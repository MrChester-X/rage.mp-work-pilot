let playerLocal = mp.players.local

let currentMarker = null;
let currentBlip = null;
let currentColshape = null;

mp.events.add("setPoint", (position, typeMarker) => {
    createMarker(position, typeMarker);
});

mp.events.add("playerEnterColshape", (colshape) => {
    if(colshape == currentColshape) {
        currentMarker.destroy();
        currentBlip.destroy();
        currentColshape.destroy();

        mp.events.callRemote("playerReachPoint");
    }
});

function createMarker(position, typeMarker) {
    currentMarker = mp.markers.new(typeMarker, position, 30.0, {
        color: [255, 0, 0, 255]
    });

    currentBlip = mp.blips.new(1, position, {
        shortRange: false
    });

    currentColshape = mp.colshapes.newSphere(position.x, position.y, position.z, 30.0);
}