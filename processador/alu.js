// Arithmetic Logic Unit - Unidade Lógica e Aritmética (ALU)

// Descrição: Responsável por realizar operações matemáticas (soma, subtração) e lógicas (AND, NOT).
// Recebe: Operandos vindos do Registrador Y (fixo na esquerda), Barramento B (na direita) e os sinais de controle do MIR.
// Envia: O resultado da operação para o Deslocador.


class ArithmeticLogicUnit {
    constructor() {
        // Flags de condição que a Unidade de Controle vai ler para fazer JUMPs
        this.flagZ = 0; // 1 se o resultado for zero
        this.flagN = 0; // 1 se o resultado for negativo
    }

    // O método principal que processa os dados com base nos sinais de controle do MIC-1
    calcular(valorY, valorBusB, mir) {
        // CONVERSÃO INTERNA ISOLADA: Transforma as fiações de string em inteiros para calcular
        const A = parseInt(valorY, 2) & 0xFFFF;
        const B = parseInt(valorBusB, 2) & 0xFFFF;
        
        let resultado = 0;

        // Monta a string de assinatura combinando as 6 linhas de controle: "F0|F1|ENA|ENB|INVA|INC"
        const assinaturaEletrica = `${mir.f0}${mir.f1}${mir.ena}${mir.enb}${mir.inva}${mir.inc}`;

        // Switch case baseado puramente na tabela oficial do Tanenbaum!
        switch (assinaturaEletrica) {
            case "011000": // A (Passa Y direto)
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
            case "111100": // A + B (Soma)
                resultado = A + B;
                break;
            case "111101": // A + B + 1 (Soma com incremento)
                resultado = A + B + 1;
                break;
            case "111001": // A + 1 (Incrementa Y)
                resultado = A + 1;
                break;
            case "110101": // B + 1 (Incrementa Bus B)
                resultado = B + 1;
                break;
            case "111111": // A - B (Subtração via Complemento de Dois)
                resultado = A + (~B & 0xFFFF) + 1;
                break;
            case "001100": // A AND B
                resultado = A & B;
                break;
            case "011100": // A OR B
                resultado = A | B;
                break;
            default:
                // Se cair aqui, a microinstrução tentou uma combinação inválida de hardware
                resultado = 0;
        }

        // Truncamento rígido de 16 bits em nível numérico
        resultado = resultado & 0xFFFF;

        // Atualização das Flags de Status (Trabalham com o valor numérico truncado)
        this.flagZ = (resultado === 0) ? 1 : 0;
        this.flagN = ((resultado & 0x8000) !== 0) ? 1 : 0;

        // RETORNO DE HARDWARE: Converte o número final calculado de volta para uma String Binária de 16 bits estável
        return resultado.toString(2).padStart(16, "0");
    }

    // Métodos para a UC ler o estado elétrico das flags
    getZeroFlag() {
        return this.flagZ;
    }

    getNegativeFlag() {
        return this.flagN;
    }
}

export default ArithmeticLogicUnit;