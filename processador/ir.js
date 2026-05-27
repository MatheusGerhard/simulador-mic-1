// Instruction Register - Registrador de Instrução (IR)

// Descrição: Mantém a instrução atual que foi buscada da memória enquanto ela é decodificada.
// Recebe: A instrução bruta vinda do Memory Data Register (MDR).
// Envia: O opcode para a Unidade de Controle e o operando (endereço) para o MAR.

class InstructionRegister {
    constructor() {
        this.value = "0000000000000000";
    }

    read() {
        return this.value;
    }

    write(newValue) {
        this.value = newValue; // Recebe a string binária vinda do MBR
    }
}

export default InstructionRegister;