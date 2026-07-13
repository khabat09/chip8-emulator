import Machine from "/core/chip8Machine.js";

let lastTime = 0;
let dt = 0;

const machine = new Machine();

function loop(time) {
    requestAnimationFrame(loop);
    dt = (time - lastTime) / 1000;
    lastTime = time;
    
}

requestAnimationFrame(loop);