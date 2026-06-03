// Amux - 

// Descrição: Recebe o valor do Latch A, MBR e o comando do MIR e seleciona o valor correto para entrar na ALU

class Amux {
    constructor() {
        this.value = "0000000000000000";
        this.aValue = "0000000000000000";
        this.mbrValue = "0000000000000000";
        this.mirValue = "0";
    }

    // Recebe valor do latch A, MBR e MIR
    write(a, b, c) {
        this.aValue = a;
        this.mbrValue = b;
        this.mirValue = c;
    }

    select() {
        if (this.mirValue == "0") {
            this.value = this.aValue;
        } 
        if (this.mirValue == "1") {
            this.value =  this.mbrValue;
        }
    }

    read() {
        return this.value;
    }
}

export default Amux;