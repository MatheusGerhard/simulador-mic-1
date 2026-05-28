// Shifter - Deslocador (SHIFTER)

// Descrição: Pode deslocar o resultado da ULA antes de enviá-lo para o Barramento C.
// Recebe: O resultado de 16 bits da ULA e os sinais de controle do MIR.
// Envia: O dado final de 16 bits diretamente para o Barramento C.

class Shifter {
    constructor() {
        this.lastBitShiftedOut = "0"; // Flag interna para o "if n then"
    }

    deslocar(valorULA, mir) {
        // Monta a assinatura incluindo o novo sinal LSHIFT (vamos assumir que o MIR 
        // agora tem o sinal lshift)
        const assinaturaShifter = `${mir.sll8}${mir.sra1}${mir.lshift || 0}`;

        switch (assinaturaShifter) {
            case "001": // LSHIFT (Logical Shift Left 1)
                // 1. O bit que "cai" à esquerda vira a flag N para a ControlUnit
                this.lastBitShiftedOut = valorULA[0];
                // 2. Desloca 1 para a esquerda, descarta o MSB e injeta 0 na direita
                return valorULA.slice(1) + "0";

            case "010": // SRA1 (Shift Right Arithmetic 1)
                return valorULA[0] + valorULA.slice(0, 15);

            case "100": // SLL8 (Shift Left Logical 8)
                return valorULA.slice(8).padEnd(16, "0");

            case "000": // Pass through
            default:
                return valorULA;
        }
    }

    // Método para a ControlUnit checar o bit que saiu (usado no if n then goto)
    getFlagN() {
        return this.lastBitShiftedOut === "1";
    }
}

export default Shifter;