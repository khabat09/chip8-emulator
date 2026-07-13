import display from "/core/display.js";

const emulator_states = {
    QUIT: 1,
    RUNNING: 2,
    PAUSED: 3
}

let lastTime = 0;
let dt = 0;

function loop(time) {
    requestAnimationFrame(loop);
    dt = (time - lastTime) / 1000;
    lastTime = time;
    
}

requestAnimationFrame(loop);