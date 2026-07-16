import Machine from "/core/chip8Machine.js";

let lastTime = 0;
let dt = 0;

const machines = [];

function loop(time) {
	requestAnimationFrame(loop);
	// dt = (time - lastTime) / 1000;
	// lastTime = time;
	// console.log(1/dt);
	machines.forEach(machine => {
		machine.emulate();
	});
}



for (let i = 0; i < 700 / 60; i++) {
	requestAnimationFrame(loop);
}

function removeMachine(machine) {
	const i = machines.indexOf(machine);
	machines.splice(i, 1);
}


const newMachineBtn = document.querySelector("#newMachine");


newMachineBtn.addEventListener("click", () => {
	const machine = new Machine(removeMachine);
	machines.push(machine);
	machine.initSound();
});