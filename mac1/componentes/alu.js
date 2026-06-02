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
        // Transforma as fiações de string em inteiros para calcular
        const A = parseInt(this.amux, 2);
        const B = parseInt(this.latchb, 2);

        switch (this.mir) {
            case "00": // A + B
                this.temp = A + B;
                break;
            case "01": // A AND B
                this.temp = A & B;
                break;
            case "10": // A
                this.temp = A;
                break;
            case "11": // INV(A)
                this.temp = (~A) + 1;
                break;
            default:
                this.temp = 0;
        }

        // Converte o para String
        this.res = this.temp.toString(2).padStart(16, "0");

        // Atualização das Flags de Status 
        this.Z = (this.res == "0000000000000000") ? 1 : 0;
        this.N = (this.res[0] == "1") ? 1 : 0;
    }

    // Envia para o Deslocador ou MSL
    read(regName) {
        return this[regName];
    }
}

export default ArithmeticLogicUnit;