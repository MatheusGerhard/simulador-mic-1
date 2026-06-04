// Arithmetic Logic Unit - Unidade Lógica e Aritmética (ALU)

// Descrição: Responsável por realizar operações matemáticas (soma, subtração) e lógicas (AND, NOT).
// Recebe: Operandos vindos do Registrador Amux (fixo na esquerda), latch B (na direita) e os sinais de controle do MIR.
// Envia: O resultado da operação para o Deslocador.


class ArithmeticLogicUnit {
    constructor() {
        this.amux = "0000000000000000";
        this.latchb = "0000000000000000";
        this.mir = "00";
        this.res = "0000000000000000";
        this.Z = 0; // 1 se o resultado for zero
        this.N = 0; // 1 se o resultado for negativo
    }

    // Recebe os valores da AMUX, latchB e MIR
    write(amux, latchb, mir) {
        this.amux = amux;
        this.latchb = latchb;
        this.mir = mir;
    }

    calcular() {
        let resArray = new Array(16).fill("0");
        switch (this.mir) {
            case "00": // A + B
                let carry = 0;
                for (let i = 15; i >= 0; i--) {
                    carry += (this.amux[i] == "1") ? 1 : 0;
                    carry += (this.latchb[i] == "1") ? 1 : 0;

                    switch (carry) {
                        case 0: resArray[i] = "0"; break;
                        case 1: resArray[i] = "1"; carry = 0; break;
                        case 2: resArray[i] = "0"; carry = 1; break;
                        case 3: resArray[i] = "1"; carry = 1; break;
                    }
                }
                break;

            case "01": // A AND B
                for (let i = 0; i < 16; i++) {
                    resArray[i] = (this.amux[i] == "1" && this.latchb[i] == "1") ? "1" : "0";
                }
                break;

            case "10": // A
                resArray = this.amux.split("");
                break;

            case "11": // NOT(A)
                for (let i = 0; i < 16; i++) {
                    resArray[i] = (this.amux[i] == "1") ? "0" : "1";
                }
                break;
        }

        this.res = resArray.join("");

        this.Z = (this.res == "0000000000000000") ? 1 : 0;
        this.N = (this.res[0] == "1") ? 1 : 0;
    }

    // Envia para o Deslocador ou MSL
    read(regName) {
        return this[regName];
    }
}

export default ArithmeticLogicUnit;