class Display {
	constructor(ca, size) {
		this.ca = ca;
		this.size = size;
		this.data = new Uint8Array(64 * 32);
		this.c = this.ca.getContext("2d");
		this.hi = 1;
	}
	
	init() {
		this.ca.width = this.size.x;
		this.ca.height = this.size.y;
	}
	
	draw() {
		this.c.fillStyle = "white";
		for (let x = 0; x < 64; x++) {
			for (let y = 0; y < 32; y++) {
				const index = y * 64 + x;
				if (this.data[index]) this.c.fillRect(x, y, 1, 1);
			}
		}
	}
	
	clearScreen() {
		this.data = new Uint8Array(64 * 32);
		this.c.clearRect(0, 0, this.ca.width, this.ca.height);
	}
}

export default Display