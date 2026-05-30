// Shifter - Deslocador (SHIFTER)

// Descrição: Pode deslocar o resultado da ULA antes de enviá-lo para o Barramento C.
// Recebe: O resultado de 16 bits da ULA e os sinais de controle do MIR.
// Envia: O dado final de 16 bits diretamente para o Barramento C.


class Shifter {
    constructor() {
        this.msb = "0";
    }

    deslocar(valorULA, mir) {
        // Monta a assinatura incluindo o novo sinal LSHIFT (vamos assumir que o MIR 
        // agora tem o sinal lshift)
        const assinaturaShifter = mir;

        switch (assinaturaShifter) {
            case "00":
                return valorULA;

            case "01": // SRA1 (Shift Right Arithmetic 1)
                return valorULA[0] + valorULA.slice(0, 31);

            case "10": // SLL8 (Shift Left Logical 8)
                return valorULA.slice(8).padEnd(32, "0");

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