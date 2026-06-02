// Memory Buffer Register - Registrador de Buffer de Memória (MBR)

// Descrição: Registrador de 16 bits que serve de interface de dados entre a CPU e a RAM.


class MemoryBufferRegister {
    constructor() {
        this.value = "0000000000000000";
    }

    // Recebe do Deslocador
    write(newValue) {
        this.value = newValue;
    }

    // Envia para AMUX
    read() {
        return this.value;
    }

    clear() {
        this.value = "0000000000000000";
    }
}

export default MemoryBufferRegister;