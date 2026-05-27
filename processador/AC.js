// Accumulator / Acumulador (AC)

// Descrição: Registro de uso geral que armazena temporariamente os resultados das operações da ALU.
// Recebe: Dados vindos da ALU ou diretamente do Memory Data Register (MDR).
// Envia: Dados para a ALU como operando ou para o MDR para serem salvos na memória.

class AC {
    // Implementação do registrador acumulador aqui
    constructor() {
        this.value = 0;
    }

    get() { return this.value; }
    set(val) { this.value = val & 0xFFFF; } // Mantém 16 bits
}
