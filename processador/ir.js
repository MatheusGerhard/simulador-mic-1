// Instruction Register - Registrador de Instrução (IR)

// Descrição: Registrador de 16 bits que armazena a macroinstrução atual que está sendo executada.
// Recebe: Strings binárias vindas do Barramento C (trazidas da memória via MBR).
// Envia: Os bits da instrução diretamente para a Unidade de Controle para decodificação.


class InstructionRegister {
    constructor() {
        this.value = "0000000000000000"; // Inicializa com uma instrução vazia (NOP)
    }

    // Usado pela Unidade de Controle para inspecionar os bits do opcode e endereço
    read() {
        return this.value;
    }

    // Escreve a instrução vinda do Barramento C
    write(newValue) {
        this.value = newValue;

    }

    clear() {
        this.value = "0000000000000000";
    }
}

export default InstructionRegister;