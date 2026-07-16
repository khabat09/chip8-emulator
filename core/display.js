import Keypad from "/ui/keypad.js";
import MachineStates from "/core/machineStates.js";

class Display {
	constructor(machine, size, scale) {
		this.machine = machine;
		this.displayDiv = document.createElement("div");
		this.displayDiv.classList.add("displayDiv");
		this.ca = document.createElement("canvas");
		
		this.consoleBtns = document.createElement("div");
		this.consoleBtns.classList.add("consoleBtns");
		this.consoleStartAndPause = document.createElement("button");
		this.consoleQuit = document.createElement("button");
		this.consoleLoadRom = document.createElement("button");
		this.filePicker = document.createElement("input");
		this.filePicker.type = "file";
		
		this.consoleBtns.appendChild(this.consoleStartAndPause)
		this.consoleBtns.appendChild(this.consoleQuit)
		this.consoleBtns.appendChild(this.consoleLoadRom)
		
		this.keypad = new Keypad(machine);
		
		this.displayDiv.appendChild(this.ca);
		this.displayDiv.appendChild(this.consoleBtns);
		this.displayDiv.appendChild(this.keypad.keypad);
		document.body.appendChild(this.displayDiv);
		this.size = size;
		this.data = new Uint8Array(64 * 32);
		this.c = this.ca.getContext("2d");
		this.hi = 1;
		this.scale = scale;
	}
	
	init() {
		this.ca.width = this.size.x * this.scale;
		this.ca.height = this.size.y * this.scale;
		
		this.consoleStartAndPause.textContent = "START";
		this.consoleQuit.textContent = "QUIT";
		this.consoleLoadRom.textContent = "LOAD ROM";
		
		this.filePicker.addEventListener("change", () => {
			const file = this.filePicker.files[0];
			this.machine.loadRom(file)
		});
		
		this.consoleStartAndPause.addEventListener("click", () => {
			if (this.machine.state == MachineStates.RUNNING) {
				this.machine.pause();
				this.consoleStartAndPause.textContent = "START";
			} else if (this.machine.state == MachineStates.PAUSED) {
				this.machine.start();
				this.consoleStartAndPause.textContent = "PAUSE";
			}
		});
		
		this.consoleQuit.addEventListener("click", () => {
			// const res = prompt("are you sure you want to quit this machine? all data and progress will be lost permently!");
			// if (!res) return;
			this.machine.quit(this.cleanup);
		});
		
		this.consoleLoadRom.addEventListener("click", () => {
			this.filePicker.click();
		});
	}
	
	cleanup() {
		if (this.displayDiv) {
			this.displayDiv.remove();
		}
	}
	
	newRom() {
		this.data = new Uint8Array(64 * 32);
	}
	
	draw() {
		for (let x = 0; x < 64; x++) {
			for (let y = 0; y < 32; y++) {
				const index = y * 64 + x;
				if (this.data[index]) this.c.fillStyle = "white";
				else this.c.fillStyle = "black";
				this.c.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
			}
		}
	}
	
	clearScreen() {
		this.data = new Uint8Array(64 * 32);
		this.c.clearRect(0, 0, this.ca.width, this.ca.height);
	}
}

export default Display