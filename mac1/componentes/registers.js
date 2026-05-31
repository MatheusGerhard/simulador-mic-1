// Registradores - Utilizados para salvar dados:

// AC - reserva para fazer conta
// Amux - entrada esquerda da ULA
// PC - endereço da próxima instrução
// SP - ponteiro para o topo da pilha

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