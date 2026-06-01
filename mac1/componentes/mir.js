// MicroInstructionRegister - Registrador de Microinstrução (MIR)

// Descrição: Registrador de controle que armazena os sinais elétricos decodificados da microinstrução atual.
// Recebe: A instrução de 32 bits do Armazenamento de Controle.


class MicroInstructionRegister {
    constructor() {
        this.label = "";       // Guarda o nome da microinstrução atual (ex: "Main1")

        this.amux = "0";    
        this.cond = "00";
        this.alu  = "00";      
        this.sh   = "00";          
        this.mbr  = "0";      
        this.mar  = "0";          
        this.rd   = "0";         
        this.wr   = "0";         
        this.enc  = "0";
        this.c    = "0000";        
        this.b    = "0000";         
        this.a    = "0000";
        this.addr = "00000000";
    }

    // Recebe a instrução do Armazenamento de Controle
    write (micro) {
        if (typeof micro !== 'object' || micro === null) return;
        
        this.label = micro.label || "";
        this.amux  = micro.amux  || "0";
        this.cond  = micro.cond  || "00";
        this.alu   = micro.alu   || "00";
        this.sh    = micro.sh    || "00";
        this.mbr   = micro.mbr   || "0";
        this.mar   = micro.mar   || "0";
        this.rd    = micro.rd    || "0";
        this.wr    = micro.wr    || "0";
        this.enc   = micro.enc   || "0";
        this.c     = micro.c     || "0000";
        this.b     = micro.b     || "0000";
        this.a     = micro.a     || "0000";
        this.addr  = micro.addr  || "00000000";
    }

    // Envia cada parte da instrução para o componente específico
    read(regName) {
        return this[regName];
    }
}

export default MicroInstructionRegister;