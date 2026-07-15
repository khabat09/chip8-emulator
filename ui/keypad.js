class Keypad {
	constructor(machine) {
		this.keypad = document.createElement("div");
		this.machine = machine;
		this.setup();
	}
	
	setup() {
		this.keypad.classList.add("keypad");
		for (let i = 0; i <= 0xf; i++) {
			const key = document.createElement("button");
			this.keypad.appendChild(key);
			key.classList.add("key");
			key.textContent = i.toString(16);
			
			key.addEventListener("touchstart", () => {
				this.machine.keyPress(i);
			});
			key.addEventListener("touchend", () => {
				this.machine.keyRelease(i);
			});
			
		}
	}
}

export default Keypad;