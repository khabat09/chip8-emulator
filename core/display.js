import Keypad from "/ui/keypad.js";

class Display {
	constructor(machine, size, scale) {
		this.displayDiv = document.createElement("div");
		this.displayDiv.classList.add("displayDiv");
		this.ca = document.createElement("canvas");
		this.keypad = new Keypad(machine);
		
		this.displayDiv.appendChild(this.ca);
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