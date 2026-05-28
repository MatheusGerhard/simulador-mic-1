// Program Counter - Contador de Programa (PC)

// Descrição: Registrador de 12 bits que armazena o endereço da próxima macroinstrução a ser buscada na RAM.
// Recebe: Dados do Barramento C (seja o PC incrementado ou um endereço de JUMP).
// Envia: Seu valor numérico para o Barramento B (para ser incrementado ou testado pela ULA).

class ProgramCounter {
    constructor() {
        this.value = "0000000000000000"; // Inicializa apontando para o endereço 0 da RAM
    }

    // Lê o valor atual (usado pelo Barramento B)
    read() {
        return this.value;
    }

    // Escreve um novo endereço vindo do Barramento C
    write(newValue) {
        this.value = newValue;
        // console.log(`>>> PC atualizado para: ${parseInt(newValue, 2)}`);
    }

    clear() {
        this.value = "0000000000000000";
    }
}

export default ProgramCounter;