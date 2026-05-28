// Memory Buffer Register - Registrador de Buffer de Memória (MBR)

// Descrição: Registrador de 16 bits que serve de interface de dados entre a CPU e a RAM.
// Recebe: Strings binárias da RAM ou números inteiros do Barramento C (saída da ULA).
// Envia: Strings binárias para a RAM, ou seu valor para o Barramento B (leitura da ULA).


class MemoryBufferRegister {
    constructor() {
        this.value = "0000000000000000"; // Inicializa zerado (16 bits)
    }

    // Método para ler o conteúdo atual do MBR
    read() {
        return this.value;
    }

    // Método para escrever um dado no MBR
    write(newValue) {
        // Corta em 16 bits
        this.value = newValue.slice(-16);
    }

    clear() {
        this.value = "0000000000000000";
    }
}

export default MemoryBufferRegister;