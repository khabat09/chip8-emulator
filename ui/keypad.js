class Keypad {
	constructor(callBack, releaseCallBack) {
		this.keypad = document.createElement("div");
		this.callBack = callBack;
		this.releaseCallBack = releaseCallBack;
		this.keys = [];
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
				this.callBack(i);
			});
			key.addEventListener("touchend", () => {
				this.releaseCallBack(i);
			});
			
		}
	}
}

export default Keypad;