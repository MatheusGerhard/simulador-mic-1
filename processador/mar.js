// Memory Address Register - Registrador de Endereço de Memória (MAR)

// Descrição: Contém o endereço de memória que o processador deseja ler ou escrever.
// Recebe: Endereços vindos do PC (para buscar instrução) ou do IR (para buscar dados).
// Envia: O endereço para o barramento de endereços da Memória Principal.

class MemoryAddressRegister {
    constructor() {
        this.value = 0; // Inicializa zerado
    }

    // Método para ler o conteúdo atual do MAR
    read() {
        return this.value;
    }

    // Método para a UC escrever um novo endereço no MAR
    write(newValue) {
        // No MIC-1, os endereços de memória usam 12 bits (0 a 4095).
        // O operador '& 0xFFFF' simula o limite físico de 16 fios elétricos.
        this.value = newValue & 0x0FFF;
    }
}

export default MemoryAddressRegister;