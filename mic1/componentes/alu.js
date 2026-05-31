// Arithmetic Logic Unit - Unidade Lógica e Aritmética (ALU)

// Descrição: Responsável por realizar operações matemáticas (soma, subtração) e lógicas (AND, NOT).
// Recebe: Operandos vindos do Registrador H (fixo na esquerda), Barramento B (na direita) e os sinais de controle do MIR.
// Envia: O resultado da operação para o Deslocador.


class ArithmeticLogicUnit {
    constructor() {
        // Flags de JUMPs para a próxima instrução
        this.Z = 0; // 1 se o resultado for zero
        this.N = 0; // 1 se o resultado for negativo
    }

    calcular(h, busb, mir) {
        // Converte para Int
        const A = parseInt(h, 2);
        const B = parseInt(busb, 2);
        
        let resultado = 0;

        switch (mir) {
            case "011000": // A (Passa H direto)
                resultado = A;
                break;
            case "010100": // B (Passa Bus B direto)
                resultado = B;
                break;
            case "011010": // NOT A
                resultado = ~A;
                break;
            case "101100": // NOT B
                resultado = ~B;
                break;
            case "111100": // A + B
                resultado = A + B;
                break;
            case "111101": // A + B + 1
                resultado = A + B + 1;
                break;
            case "111001": // A + 1
                resultado = A + 1;
                break;
            case "110101": // B + 1
                resultado = B + 1;
                break;
            case "111111": // B - A
                resultado = B + (~A) + 1;
                break;
            case "110110": // B - 1
                resultado = B - 1;
                break;
            case "111011": // -A
                resultado = (~A) + 1;
                break;
            case "001100": // A AND B
                resultado = A & B;
                break;
            case "011100": // A OR B
                resultado = A | B;
                break;
            case "010000": // 0
                resultado = 0;
                break;
            case "110001": // 1
                resultado = 1;
                break;
            case "110010": // -1
                resultado = -1;
                break;
            default:
                resultado = 0;
        }

        // Truncamento de 16 bits 
        resultado = resultado & 0xFFFFFFFF;

        // Atualização das Flags de Status
        this.Z = (resultado === 0) ? 1 : 0;
        this.N = ((resultado & 0x80000000) !== 0) ? 1 : 0;

        // Converte para String
        return resultado.toString(2).padStart(32, "0");
    }

    // Envia para o Bit Alto
    getZ() {
        return this.Z;
    }
    getN() {
        return this.N;
    }
}

export default ArithmeticLogicUnit;