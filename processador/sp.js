// Stack Pointer - Ponteiro de Pilha (SP)

// Descrição: Guarda o endereço de memória do topo da pilha de execução.
// Conexão: Pode colocar seu valor no barramento B para ser manipulado pela ULA e receber dados do barramento C.

class StackPointer {
    constructor() {
        // Na maioria das arquiteturas, a pilha começa no final da memória e "cresce" para baixo.
        // Vamos inicializá-lo zerado, cabendo ao programa definir seu topo inicial.
        this.value = 0; 
    }

    // Lê o valor atual do SP (16 bits)
    read() {
        return this.value;
    }

    // Escreve um novo endereço no SP (vindo do barramento C)
    write(newValue) {
        if (typeof newValue === "string") {
            this.value = parseInt(newValue, 2) & 0xFFFF;
        } else {
            this.value = newValue & 0xFFFF; // Truncamento purista de hardware
        }
    }

    // Facilitadores de microinstruções (SP = SP + 1 ou SP = SP - 1)
    increment() {
        this.value = (this.value + 1) & 0xFFFF;
    }

    decrement() {
        this.value = (this.value - 1) & 0xFFFF;
    }
}

export default StackPointer;