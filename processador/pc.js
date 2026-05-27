// Program Counter - Contador de Programa (PC)

// Descrição: Armazena o endereço de memória da próxima instrução a ser buscada e executada.
// Recebe: Sinal de incremento (+1) ou um novo endereço (proveniente de instruções de desvio/jump).
// Envia: O endereço atual para o Memory Address Register (MAR) para iniciar o ciclo de busca.

class ProgramCounter {
    constructor() {
        this.value = 0; // O programa começa na posição 0 da memória
    }

    
    // Método para o processador saber qual é o endereço atual
    read() {
        return this.value;
    }

    // Força um endereço específico no PC (usado em instruções de JUMP/Desvio)
    write(newValue) {        
        this.value = newValue & 0x0FFF;
    }
    // 0x0FFF mantém o limite físico de 12 bits do barramento de endereços

    // Aumenta o contador em 1
    increment() {
        this.value = (this.value + 1) & 0x0FFF;
    }
}

export default ProgramCounter;