// Program Counter / Contador de Programa (PC)

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

    // Método usado no "pc := pc + 1" (Linha 1 da sua tabela)
    increment() {
        this.value = this.value + 1;
    }
}

// Exporta uma instância pronta do PC para o processador usar
const pc = new ProgramCounter();
export default pc;
