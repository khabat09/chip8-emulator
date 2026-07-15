import STATES from "/core/machineStates.js";
import Display from "/core/display.js";


const chip8FontSet = new Uint8Array([
	0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
	0x20, 0x60, 0x20, 0x20, 0x70, // 1
	0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
	0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
	0x90, 0x90, 0xF0, 0x10, 0x10, // 4
	0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
	0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
	0xF0, 0x10, 0x20, 0x40, 0x40, // 7
	0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
	0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
	0xF0, 0x90, 0xF0, 0x90, 0x90, // A
	0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
	0xF0, 0x80, 0x80, 0x80, 0xF0, // C
	0xE0, 0x90, 0x90, 0x90, 0xE0, // D
	0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
	0xF0, 0x80, 0xF0, 0x80, 0x80 // F
]);


class Chip8Machine {
	constructor() {
		this.ca = document.createElement("canvas");
		document.body.appendChild(this.ca);
		this.display = new Display(
			this.ca, { x: 64, y: 32 }
		);
		this.state = STATES.PAUSED;
		this.isRomLoaded = 0;
		
		//
		this.memory = new Uint8Array(4096);
		this.stack = new Uint16Array(12);
		this.stackIndex = 0;
		this.PC = 0x200;
		this.V = new Uint8Array(16);
		this.I = 0;
		this.delayTimer = 0;
		this.soundTimer = 0;
		this.keypad = new Uint8Array(16);
		this.inst = new Instruction();
		
		
		//
		this.loadFontSet();
		this.loadRom();
		
		this.display.init();
	}
	
	
	loadFontSet() {
		for (let i = 0; i < chip8FontSet.length; i++) {
			this.memory[i] = chip8FontSet[i];
		}
	}
	
	async loadRom() {
		this.isRomLoaded = 0;
		const res = await fetch("/roms/IBM Logo.ch8");
		const buffer = await res.arrayBuffer();
		const data = new Uint8Array(buffer);
		for (let i = 0; i < data.length; i++) {
			this.memory[this.PC + i] = data[i];
		}
		console.log(data)
		console.log(this.memory);
		this.isRomLoaded = 1;
	}
	
	emulateInst() {
		this.inst.opcode = (this.memory[this.PC] << 8) | (this.memory[this.PC + 1]);
		this.PC += 2;
		
		// console.log(`opcode: 0x${this.inst.opcode.toString(16)} and we did`);
		
		this.inst.NNN = this.inst.opcode & 0x0fff;
		this.inst.NN = this.inst.opcode & 0x0ff;
		this.inst.N = this.inst.opcode & 0x0f;
		this.inst.X = (this.inst.opcode >> 8) & 0x0f;
		this.inst.Y = (this.inst.opcode >> 4) & 0x0f;
		
		switch ((this.inst.opcode >> 12) & 0x0f) {
			case 0x00:
				if (this.inst.NN == 0xe0) {
					// 0x0e0 clear screen
					this.display.clearScreen();
				} else if (this.inst.NN = 0xee) {
					this.PC = this.stack[this.stackIndex--];
				}
				break;
				
			case 0x01:
				this.PC = this.inst.NNN;
				break;
				
			case 0x02:
				this.stack[this.stackIndex++] = this.PC;
				this.PC = this.inst.NNN;
				break;
				
			case 0x03:
				if (this.V[this.inst.x] == this.inst.NN) {
					this.PC += 2;
				}
				break;
				
			case 0x04:
				if (this.V[this.inst.X] != this.NN) this.PC += 2;
				break;
				
			case 0x05:
				if (this.V[this.inst.X] == this.V[this.inst.Y]) this.PC += 2;
				break;
				
			case 0x06:
				this.V[this.inst.X] = this.inst.NN;
				break;
				
			case 0x07:
				this.V[this.inst.X] += this.inst.NN;
				break;
				
			case 0x08:
				switch (this.inst.N) {
					case 0x00:
						this.V[this.inst.X] = this.V[this.inst.Y];
						break;
					case 0x01:
						this.V[this.inst.X] |= this.V[this.inst.Y];
						break;
					case 0x02:
						this.V[this.inst.X] &= this.V[this.inst.Y];
						break;
					case 0x03:
						this.V[this.inst.X] ^= this.V[this.inst.Y];
						break;
					case 0x04:
						if (this.V[this.inst.X] + this.V[this.inst.Y] > 255) this.V[0xf] = 1;
						else this.V[0xf] = 0;
						this.V[this.inst.X] += this.V[this.inst.Y];
						break;
					case 0x05:
						if (this.V[this.inst.X] > this.V[this.inst.Y]) this.V[0xf] = 0;
						else this.V[0xf] = 1;
						this.V[this.inst.X] = this.V[this.inst.Y];
						break;
					case 0x06:
						this.V[0xf] = (this.V[this.inst.X] << 7) >> 7;
						this.V[this.inst.X] >>= 1;
						break;
					case 0x07:
						if (this.V[this.inst.Y] > this.V[this.inst.X]) this.V[0xf] = 0;
						else this.V[0xf] = 1;
						this.V[this.inst.X] = this.V[this.inst.Y] - this.V[this.inst.X];
						break;
					case 0xE:
						this.V[0xf] = this.V[this.inst.X] >> 7;
						this.V[this.inst.X] <<= 1;
						break;
					default:
					break;
				}
				break;
			
			case 0x09:
				if(this.V[this.inst.X] != this.V[this.inst.Y])this.PC += 2;
				break;
				
			case 0x0a:
				this.I = this.inst.NNN;
				break;
			
			case 0x0b:
				this.PC = this.V[0] + this.inst.NNN;
				break;
				
			case 0x0c:
				this.V[this.inst.X] = Math.floor(Math.random() * 256) & this.inst.NN;
				break;
			
			case 0x0d:
				this.doInstDXYN();
				break;
				
			case 0x0f:
				switch(this.inst.NN){
					case 0x07:
						this.V[this.inst.X] = this.delayTimer;
						break;
					
					case 0x15:
						this.delayTimer = this.V[this.inst.X];
						break;
						
					case 0x18:
						this.soundTimer = this.V[this.inst.X];
						break;
						
					case 0x1e:
						this.I += this.V[this.inst.X];
						break;
					
					
						
				}
			
			default:
				console.log("unimplemented opcode")
				//throw new Error("ummm this rom is broken it uses an instruction that hasnt been implemented! so dont use it ok😭")
		}
		this.display.draw();
	}
	
	
	doInstDXYN() {
		this.V[0xf] = 0;
		const xCoord = this.V[this.inst.X] % 64;
		const yCoord = this.V[this.inst.Y] % 32;
		const width = 8;
		const height = this.inst.N;
		
		for (let i = 0; i < height; i++) {
			if (yCoord + i >= 32) break;
			for (let j = width - 1; j >= 0; j--) {
				if (xCoord + j >= 64) break;
				const spriteData = this.memory[this.I + i];
				const spritePixel = (this.memory[this.I + i] & (1 << j)) >> j;
				let displayPixel = this.display.data[(yCoord + i) * 64 + (xCoord + (7 - j))];
				if (spritePixel && displayPixel) {
					this.V[0xf] = 1;
				}
				displayPixel ^= spritePixel;
				this.display.data[(yCoord + i) * 64 + (xCoord + (7 - j))] = displayPixel;
			}
		}
	}
	
}

class Instruction {
	constructor() {
		this.opcode = 0;
		this.NNN = 0;
		this.NN = 0;
		this.N = 0;
		this.X = 0;
		this.Y = 0;
	}
}


export default Chip8Machine;