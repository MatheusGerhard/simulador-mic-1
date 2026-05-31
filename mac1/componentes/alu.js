// Arithmetic Logic Unit - Unidade Lógica e Aritmética (ALU)

// Descrição: Responsável por realizar operações matemáticas (soma, subtração) e lógicas (AND, NOT).
// Recebe: Operandos vindos do Registrador Amux (fixo na esquerda), latch B (na direita) e os sinais de controle do MIR.
// Envia: O resultado da operação para o Deslocador.


class ArithmeticLogicUnit {
    constructor() {
        this.Z = 0; // 1 se o resultado for zero
        this.N = 0; // 1 se o resultado for negativo
    }

    calcular(amux, latchb, mir) {
        // Transforma as fiações de string em inteiros para calcular
        const A = parseInt(amux, 2);
        const B = parseInt(latchb, 2);
        
        let resultado = 0;

        switch (mir) {
            case "00": // A AND B
                resultado = A & B;
                break;
            case "01": // A OR B
                resultado = A | B;
                break;
            case "10": // NOT B
                resultado = ~B;
                break;
            case "11": // ADD
                resultado = A + B;
                break;
            default:
                resultado = 0;
        }

        // Truncamento de 16 bits
        resultado = resultado & 0xFFFF;

        // Atualização das Flags de Status 
        this.Z = (resultado === 0) ? 1 : 0;
        this.N = ((resultado & 0x8000) !== 0) ? 1 : 0;

        // Converte o para String
        return resultado.toString(2).padStart(16, "0");
    }

    // Envia para o MSL
    getZ() {
        return this.Z;
    }
    getN() {
        return this.N;
    }
}

export default ArithmeticLogicUnit;