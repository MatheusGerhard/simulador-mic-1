// Memory Address Register - Registrador de Endereço de Memória (MAR)

// Descrição: Registrador de 12 bits que armazena o endereço de memória que será lido ou escrito.

class MemoryAddressRegister {
    constructor() {
        this.value = "0000000000000000";
    }

    // Recebe o endereço do latchB
    write(newValue) {
        this.value = newValue;
    }

    // Usado pela Memória RAM para saber qual endereço ler/escrever
    read() {
        return this.value;
    }    

    clear() {
        this.value = "0000000000000000";
    }
}

export default MemoryAddressRegister;