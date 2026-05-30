// MicroInstructionRegister - Registrador de Microinstrução (MIR)

// Descrição: Registrador de controle que armazena os sinais elétricos decodificados da microinstrução atual.
// Recebe: A instrução de 36 bits do Armazenamento de Controle.


class MicroInstructionRegister {
    constructor() {
        // --- Metadados de Depuração ---
        this.label = "";       // Guarda o nome da microinstrução atual (ex: "Main1")

        this.addr = "000000000";    // Próximo endereço
        this.jam = "000";           // Jumps
        this.ula  = "000000";       // ULA = f0, f1, ena, enb, inva, inc
        this.des  = "00";           // sll8 e sra1
        this.c  = "000000000";      // Barramento C
        this.mem   = "000";         // Leitura/Escrita
        this.b  = "0000";           // Barramento B  
    }

    // Recebe a instrução do Armazenamento de controle
    write (micro) {
        if (typeof micro !== 'object' || micro === null) return;
        
        this.label = micro.label || "";
        this.addr  = micro.addr  || "000000000";
        this.jam   = micro.jam   || "000";
        this.ula   = micro.ula   || "000000";
        this.des   = micro.des   || "00";
        this.c     = micro.c     || "000000000";
        this.mem   = micro.mem   || "000";
        this.b     = micro.b     || "0000";
    }

    // Envia cada parte da instrução para o componente específico
    read(regName) {
        return this[regName];
    }
}

export default MicroInstructionRegister;