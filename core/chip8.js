import Machine from "/core/chip8Machine.js";

let lastTime = 0;
let dt = 0;

const machine = new Machine();

function loop(time) {
	requestAnimationFrame(loop);
	// dt = (time - lastTime) / 1000;
	// lastTime = time;
	// console.log(1/dt);
	machine.emulate();
	
}

for(let i = 0; i < 700/60; i++){
	requestAnimationFrame(loop);
}