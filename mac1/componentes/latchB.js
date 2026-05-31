// B latch

// Descrição: Registrador de 16 bits que serve como a entrada fixa direita da ULA.

class latchB {
    constructor() {
        this.value = "0000000000000000"; 
    }

    // Recebe valor vindo do barB
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

export default latchB;