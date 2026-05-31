// Amux - entrada esquerda da ULA:

class Registers {
    constructor() {
        this.value = "0000000000000000";
    }

    // Recebe um valor do MBR e A latch
    write(newValue) {
        this.value = newValue;
    }

    // Envia envia para ULA.
    read() {
        return this.value;
    }

    clear() {
        this.value = "0000000000000000";
    }
}

export default Registers;