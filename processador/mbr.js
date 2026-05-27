// Memory Buffer Register - Registrador de Buffer de Memória (MBR)

// Descrição: Atua como um buffer de dados entre a CPU e a memória.
// Recebe: Dados vindos da Memória Principal (leitura) ou do AC (escrita).
// Envia: Dados para o IR, AC ou de volta para a Memória Principal.

class MemoryBufferRegister {
    constructor() {
        this.value = 0; // Inicializa zerado (16 bits)
    }

    // Método para ler o conteúdo atual do MBR
    read() {
        return this.value;
    }

    // Método para escrever um dado no MBR
    write(newValue) {
        // No MIC-1, o barramento de dados é de 16 bits (valores de 0 a 65535).
        // O operador '& 0xFFFF' simula o limite físico de 16 fios elétricos.
        this.value = newValue & 0xFFFF;
    }
}

export default MemoryBufferRegister;