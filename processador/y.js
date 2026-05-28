// Registrador Y (Y)

// Descrição: Registrador de 16 bits que serve como a entrada fixa esquerda da ULA.
// Recebe: Dados do Barramento C (para travar o primeiro operando de uma operação).
// Envia: Dados para a entrada esquerda da ULA.

class RegisterY {
    constructor() {
        this.value = "0000000000000000"; // Inicializa zerado (16 bits)
    }

    // Usado diretamente pela ULA a cada ciclo de cálculo
    read() {
        return this.value;
    }

    // Escreve um valor vindo do Barramento C
    write(newValue) {
        this.value = newValue;
    }

    clear() {
        this.value = "0000000000000000";
    }
}

export default RegisterY;