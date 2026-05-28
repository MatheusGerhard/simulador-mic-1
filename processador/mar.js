// Memory Address Register - Registrador de Endereço de Memória (MAR)

// Descrição: Registrador de 12 bits que armazena o endereço de memória que será lido ou escrito.
// Recebe: Dados do Barramento C (endereços calculados ou ponteiros como PC, SP, LV).
// Envia: O endereço diretamente para a linha de controle da Memória RAM.

class MemoryAddressRegister {
    constructor() {
        this.value = "0000000000000000"; // Inicializa zerado (12 bits numéricos)
    }

    // Usado pela Memória RAM para saber qual endereço ler/escrever
    read() {
        return this.value;
    }

    // Escreve um endereço vindo do Barramento C
    write(newValue) {
        this.value = newValue;
    }

    clear() {
        this.value = "0000000000000000";
    }
}

export default MemoryAddressRegister;