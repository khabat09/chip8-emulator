class Keypad {
	constructor(machine) {
		this.machine = machine;
		this.keypad = document.createElement("div");
		this.setup();
	}
	setup() {
		this.keypad.classList.add("keypad");
		for (let i = 0; i <= 0xf; i++) {
			const key = document.createElement("button");
			this.keypad.appendChild(key);
			key.classList.add("key");
			key.textContent = i.toString(16);
			
			key.addEventListener("touchstart", (e) => {
				e.preventDefault();
				this.machine.keyPress(i);
			});
			key.addEventListener("touchend", (e) => {
				e.preventDefault();
				this.machine.keyRelease(i);
			});
			key.addEventListener("mousedown", () => {
				this.machine.keyPress(i);
			});
			key.addEventListener("mouseup", () => {
				this.machine.keyRelease(i);
			});
			key.addEventListener("mouseleave", () => {
				this.machine.keyRelease(i);
			});
			
		}
	}
}

export default Keypad;