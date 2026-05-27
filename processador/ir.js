// Instruction Register - Registrador de Instrução (IR)

// Descrição: Mantém a instrução atual que foi buscada da memória enquanto ela é decodificada.
// Recebe: A instrução bruta vinda do Memory Data Register (MDR).
// Envia: O opcode para a Unidade de Controle e o operando (endereço) para o MAR.

class InstructionRegister {
    constructor() {
        this.value = 0; // Inicializa zerado (16 bits)
    }

    // Método para ler o conteúdo atual do IR
    read() {
        return this.value;
    }

    // Método usado no "ir := mbr"
    write(newValue) {
        // O operador '& 0xFFFF' simula o limite físico de 16 fios elétricos.
        this.value = newValue & 0xFFFF;
    }
}

export default InstructionRegister;