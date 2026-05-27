// Arithmetic Logic Unit - Unidade Lógica e Aritmética (ALU)

// Descrição: Responsável por realizar operações matemáticas (soma, subtração) e lógicas (AND, NOT).
// Recebe: Operandos vindos do Registrador Y (fixo na esquerda) e Barramento B (na direita).
// Envia: O resultado da operação para o AC e atualiza flags de status (Zero, Negativo).

// Arithmetic Logic Unit / Unidade Lógica e Aritmética (ALU / ULA)
// Descrição: Executa as operações matemáticas e lógicas do processador.
// Entradas: Registrador Y (fixo na esquerda) e Barramento B (na direita).
// Saídas: Um resultado de 16 bits e duas flags de estado (Z e N).

class ArithmeticLogicUnit {
    constructor() {
        // Flags de condição que a Unidade de Controle vai ler para fazer JUMPs
        this.flagZ = 0; // Zero flag
        this.flagN = 0; // Negative flag
    }

    // O método principal que processa os dados com base nos sinais de controle do MIC-1
    calcular(valorY, valorBusB, sinais) {
        // sinais é um objeto contendo: { f0, f1, ena, enb, inva, inc }
        
        // 1. Aplica os sinais de Enable (ENA e ENB)
        let a = sinais.ena ? valorY : 0;
        let b = sinais.enb ? valorBusB : 0;

        // 2. Aplica o sinal INVA (Inverte a entrada A bit a bit)
        if (sinais.inva) {
            a = ~a & 0xFFFF;
        }

        let resultado = 0;

        // 3. Seleciona a operação pelas chaves F0 e F1
        // Função 00: A AND B
        // Função 01: A OR B
        // Função 10: NOT B
        // Função 11: A + B (Soma)
        const seletor = (sinais.f0 << 1) | sinais.f1;

        switch (seletor) {
            case 0: // 00: AND
                resultado = a & b;
                break;
            case 1: // 01: OR
                resultado = a | b;
                break;
            case 2: // 10: NOT B
                resultado = ~b & 0xFFFF;
                break;
            case 3: // 11: SOMA
                resultado = a + b;
                break;
        }

        // 4. Aplica o sinal INC (Incrementa +1 no resultado final, usado para somar 1 ou fazer complemento de 2)
        if (sinais.inc) {
            resultado = resultado + 1;
        }

        // 5. COMPORTAMENTO DE HARDWARE: Truncamento purista de 16 bits no Barramento C
        resultado = resultado & 0xFFFF;

        // 6. Atualiza as Flags de Condição baseadas no resultado final
        this.flagZ = (resultado === 0) ? 1 : 0;
        
        // Verifica se o 16º bit (bit de sinal em 16 bits: 0x8000) está ativo
        this.flagN = ((resultado & 0x8000) !== 0) ? 1 : 0;

        return resultado;
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