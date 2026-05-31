// Shifter - Deslocador (SHIFTER)

// Descrição: Pode deslocar o resultado da ULA antes de enviá-lo para MBR.


class Shifter {
    constructor() {
        this.msb = "0";
    }

    deslocar(valorULA, mir) {
        switch (mir) {
            case "00":
                return valorULA;

            case "01": // SRA1 (Shift Right Arithmetic 1)
                return valorULA[0] + valorULA.slice(0, 15);

            case "10": // SLL8 (Shift Left Logical 8)
                return valorULA.slice(8).padEnd(16, "0");

            case "11": // Exemplo: LSHIFT (Logical Shift Left 1)
                // 1. O bit que "cai" à esquerda vira a flag N para a ControlUnit
                this.msb = valorULA[0];
                // 2. Desloca 1 para a esquerda, descarta o MSB e injeta 0 na direita
                return valorULA.slice(1) + "0";


            default:
                return valorULA;
        }
    }
}

export default Shifter;