// Accumulator - Acumulador (AC)

// Descrição: Registrador de uso geral que armazena temporariamente os resultados das operações da ULA.
// Recebe: Dados do Barramento C.
// Envia: Dados para o Barramento B.

class Accumulator {
    constructor() {
        this.value = "0000000000000000"; // Inicializa zerado (16 bits numéricos)
    }

    // Envia o valor numérico para o Barramento B
    read() {
        return this.value;
    }

    // Escreve um dado vindo do Barramento C aplicando a máscara rígida de 16 bits
    write(newValue) {
        this.value = newValue;
    }

    // Zera o registrador no reset do sistema
    clear() {
        this.value = "0000000000000000";
    }
}

export default Accumulator;