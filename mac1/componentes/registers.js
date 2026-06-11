// Registradores - Utilizados para salvar dados:

// 0000: PC - o endereço da próxima macroinstrução
// 0001: AC - temporariamente os resultados das operações da ULA
// 0010: SP - ponteiro para o topo da pilha
// 0011: IR - a macroinstrução atual
// 0100: TIR - instrução temporaria
// 0101: 0 - valor nulo
// 0110: +1 - 1
// 0111: -1 - -1
// 1000: AM - máscara 12 bits
// 1001: SM - máscara 8 bits
// 1010: A - genérico
// 1011: B - genérico
// 1100: C - genérico
// 1101: D - genérico
// 1110: E - genérico
// 1111: F - genérico


class Registers {
    constructor() {
        this.data = new Array(16);
        this.data = [
            "0000000000000000", // PC = 0000
            "0000000000000000", // AC = 0001
            "0000000000000000", // SP = 0010
            "0000000000000000", // IR = 0011
            "0000000000000000", // TIR= 0100
            "0000000000000000", // 0  = 0101
            "0000000000000001", // +1 = 0110
            "1111111111111111", // -1 = 0111
            "0000111111111111", // AM = 1000
            "0000000011111111", // SM = 1001
            "0000000000000000", // A  = 1010
            "0000000000000000", // B
            "0000000000000000", // C
            "0000000000000000", // D
            "0000000000000000", // E
            "0000000000000000"  // F
        ]
    }

    // Recebe em um valor via Barramento C (Exceto MBR)
    write(regNum, newValue) {
        this.data[regNum] = newValue;
    }

    // Envia um valor de um registrador específico para o Barramento B, exceto H que envia para ULA.
    read(regNum) {
        return this.data[regNum];
    }
    readAll() {
        return this.data;
    }

    // Reseta todos os registradores para zero
    clear() {
        this.data = [
            "0000000000000000", // PC = 0000
            "0000000000000000", // AC = 0001
            "0000000000000000", // SP = 0010
            "0000000000000000", // IR = 0011
            "0000000000000000", // TIR= 0100
            "0000000000000000", // 0  = 0101
            "0000000000000001", // +1 = 0110
            "1111111111111111", // -1 = 0111
            "0000111111111111", // AM = 1000
            "0000000011111111", // SM = 1001
            "0000000000000000", // A  = 1010
            "0000000000000000", // B
            "0000000000000000", // C
            "0000000000000000", // D
            "0000000000000000", // E
            "0000000000000000"  // F
        ]
    }
}

export default Registers;