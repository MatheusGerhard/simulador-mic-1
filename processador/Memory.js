class Memory {
    constructor(size = 4096) {
        this.data = new Array(size).fill("0000000000000000");
    }

    read(address) {
        return this.data[address];
    }

    write(address, value) {
        this.data[address] = value;
    }
}

const memoria = new Memory();

export default memoria;