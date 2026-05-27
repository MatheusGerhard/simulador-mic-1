// Memory Buffer Register - Registrador de Buffer de Memória (MBR)

// Descrição: Atua como um buffer de dados entre a CPU e a memória.
// Recebe: Dados vindos da Memória Principal (leitura) ou do AC (escrita).
// Envia: Dados para o IR, AC ou de volta para a Memória Principal.

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
        if (typeof newValue === "number") {
            // Se vier um número (ex: da ULA), corta em 16 bits e converte para string binária de 16 caracteres
            this.value = (newValue & 0xFFFF).toString(2).padStart(16, '0');
        } else {
            // Se já vier a string binária da memória, aceita direto
            this.value = newValue;
        }
    }
}

export default MemoryBufferRegister;