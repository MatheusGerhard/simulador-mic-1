// A latch

// Descrição: Registrador de 16 bits que serve como a entrada fixa esquerda da ULA.

class latchA {
    constructor() {
        this.value = "0000000000000000"; 
    }

    // Recebe valor vindo do barA
    write(newValue) {
        this.value = newValue;
    }

    // Envia a ULA
    read() {
        return this.value;
    }   

    clear() {
        this.value = "0000000000000000";
    }
}

export default latchA;