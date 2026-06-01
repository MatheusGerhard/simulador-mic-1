// Registradores - Utilizados para salvar dados:

// 0000: AC - reserva para fazer conta
// 0001: IR - a macroinstrução atual
// 0010: PC - o endereço da próxima macroinstrução
// 0011: SP - ponteiro para o topo da pilha

class Registers {
    constructor() {
        this.data = new Array(16).fill(null);
    }

    // Recebe em um valor via Barramento C (Exceto MBR)
    write(regNum, newValue) {
        this.data[regNum] = newValue;
    }

    // Envia um valor de um registrador específico para o Barramento B, exceto H que envia para ULA.
    read(regNum) {
        return this.data[regNum];
    }

    // Reseta todos os registradores para zero
    clear() {
        this.data = new Array(16).fill("0000000000000000");
    }
}

export default Registers;