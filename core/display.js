class Display {
    constructor(ca, size) {
        this.ca = ca;
        this.size = size;
    }
    
    init() {
        this.ca.width = this.size.x;
        this.ca.height = this.size.y;
        this.ca.style.backgroundColor = "yellow";
    }
}

const display = new Display(
    document.querySelector("#display"), { x: 64, y: 32 }
);

display.init();

export default display