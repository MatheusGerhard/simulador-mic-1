// Stack Pointer - Ponteiro de Pilha (SP)

// Descrição: Registrador de 16 bits que armazena o endereço de memória do topo da pilha atual.
// Recebe: Dados do Barramento C (geralmente incrementado ou decrementado durante operações de PUSH/POP).
// Envia: Seu valor numérico para o Barramento B (para contas na ULA ou para indexar endereços).

class StackPointer {
    constructor() {
        this.value = "0000000000000000"; // Inicializa zerado (16 bits numéricos)
    }

    // Envia o valor para o Barramento B
    read() {
        return this.value;
    }

    // Escreve o novo endereço vindo do Barramento C
    write(newValue) {
        this.value = newValue;
    }

    // Zera o registrador no reset do sistema
    clear() {
        this.value = "0000000000000000";
    }
}

export default StackPointer;