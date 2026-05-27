// Registrador Y (Y)

// Descrição: Registrador de 16 bits que serve como a entrada fixa esquerda da ULA.
// Conexão: É carregado pelo barramento A/B e mantém o valor estável para a ULA.

class RegisterY {
    constructor() {
        this.value = 0; // Inicializa zerado (16 bits)
    }

    // Lê o valor numérico atual (alimenta diretamente o lado esquerdo da ULA)
    read() {
        return this.value;
    }

    // Escreve um dado vindo do barramento interno para preparar uma operação da ULA
    write(newValue) {
        if (typeof newValue === "string") {
            this.value = parseInt(newValue, 2) & 0xFFFF;
        } else {
            this.value = newValue & 0xFFFF; // Truncamento purista de hardware
        }
    }
}

export default RegisterY;