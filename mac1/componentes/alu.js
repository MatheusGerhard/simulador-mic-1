// Arithmetic Logic Unit - Unidade Lógica e Aritmética (ALU)

// Descrição: Responsável por realizar operações matemáticas (soma, subtração) e lógicas (AND, NOT).
// Recebe: Operandos vindos do Registrador Amux (fixo na esquerda), latch B (na direita) e os sinais de controle do MIR.
// Envia: O resultado da operação para o Deslocador.


class ArithmeticLogicUnit {
    constructor() {
        this.amux = "0000000000000000";
        this.latchb = "0000000000000000";
        this.mir = "00";
        this.temp = 0;
        this.res = "0000000000000000";
        this.Z = 0; // 1 se o resultado for zero
        this.N = 0; // 1 se o resultado for negativo
    }

    write(amux, latchb, mir) {
        this.amux = amux;
        this.latchb = latchb;
        this.mir = mir;
    }

    calcular() {
    const A = parseInt(this.amux, 2);
    const B = parseInt(this.latchb, 2);

    switch (this.mir) {
        case "00": this.temp = (A + B) & 0xFFFF;  break; // A + B
        case "01": this.temp = (A & B) & 0xFFFF;  break; // A AND B
        case "10": this.temp = A & 0xFFFF;         break; // A
        case "11": this.temp = (~A) & 0xFFFF;  break; // NEG(A) em C2
    }

    this.res = this.temp.toString(2).padStart(16, "0");

    this.Z = (this.temp === 0) ? 1 : 0;
    // Bit mais significativo indica negativo em C2
    this.N = (this.temp & 0x8000) ? 1 : 0;
}

    // Envia para o Deslocador ou MSL
    read(regName) {
        return this[regName];
    }
}

export default ArithmeticLogicUnit;