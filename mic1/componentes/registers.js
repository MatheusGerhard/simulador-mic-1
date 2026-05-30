// Registradores - Utilizados para salvar dados:

// MAR - endereço da RAM
// MDR - conteúdo da RAM
// PC - endereço da próxima instrução
// MBR - conteúdo da RAM
// SP - ponteiro para o topo da pilha
// LV - ponteiro para o quadro de variáveis locais
// CPP - ponteiro para a área de constantes
// TOS - cópia do valor no topo da pilha para otimização
// OPC - registrador temporário para saltos (Old Program Counter)
// H - entrada esquerda da ULA

class Registers {
    constructor() {
        this.mar = "00000000000000000000000000000000";
        this.mdr = "00000000000000000000000000000000";
        this.pc  = "00000000000000000000000000000000";
        this.mbr = "00000000000000000000000000000000";
        this.sp  = "00000000000000000000000000000000";
        this.lv  = "00000000000000000000000000000000";
        this.cpp = "00000000000000000000000000000000";
        this.tos = "00000000000000000000000000000000";
        this.opc = "00000000000000000000000000000000";
        this.h   = "00000000000000000000000000000000";
    }

    // Recebe em um valor via Barramento C (Exceto MBR)
    write(regName, newValue) {
        this[regName] = newValue;
    }

    // Envia um valor de um registrador específico para o Barramento B, exceto H que envia para ULA.
    read(regName) {
        return this[regName];
    }

    // Reseta todos os registradores para zero
    clear() {
        this.mar = "00000000000000000000000000000000";
        this.mdr = "00000000000000000000000000000000";
        this.pc  = "00000000000000000000000000000000";
        this.mbr = "00000000000000000000000000000000";
        this.sp  = "00000000000000000000000000000000";
        this.lv  = "00000000000000000000000000000000";
        this.cpp = "00000000000000000000000000000000";
        this.tos = "00000000000000000000000000000000";
        this.opc = "00000000000000000000000000000000";
        this.h   = "00000000000000000000000000000000";
    }
}

export default Registers;