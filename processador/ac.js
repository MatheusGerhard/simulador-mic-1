// Accumulator - Acumulador (AC)

// Descrição: Registro de uso geral que armazena temporariamente os resultados das operações da ALU.
// Recebe: Dados vindos da ALU ou diretamente do Memory Data Register (MDR).
// Envia: Dados para a ALU como operando ou para o MDR para serem salvos na memória.

class Accumulator {
    constructor() {
        this.value = 0; // Inicializa zerado (16 bits numéricos)
    }

    // Lê o valor numérico atual (útil para cálculos internos da ULA)
    read() {
        return this.value;
    }

    // Lê o valor convertido em String Binária de 16 bits (perfeito para o MBR ou Frontend)
    readBinary() {
        return this.value.toString(2).padStart(16, '0');
    }

    // Escreve um dado vindo do barramento C (saída da ULA ou atribuição direta)
    write(newValue) {
        if (typeof newValue === "string") {
            // Se por acaso vier uma string binária, converte para número antes de guardar
            this.value = parseInt(newValue, 2) & 0xFFFF;
        } else {
            // Comportamento elétrico padrão: trunca em 16 bits se houver overflow
            this.value = newValue & 0xFFFF;
        }
    }

    // Zera o registrador (equivalente a uma linha de controle que limpa o AC)
    clear() {
        this.value = 0;
    }
}

export default Accumulator;
