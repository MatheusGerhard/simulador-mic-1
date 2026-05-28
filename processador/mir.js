// MicroInstructionRegister - Registrador de Microinstrução (MIR) (microinstructionRegister.js)

// Descrição: Registrador de controle que armazena os sinais elétricos decodificados da microinstrução atual.
// Recebe: O objeto de controle vindo da ROM (Memória de Controle).

class MicroInstructionRegister {
    constructor() {
        // --- Metadados de Depuração ---
        this.label = "";       // Guarda o nome da microinstrução atual (ex: "Main1")

        // --- Sinais de Escrita do Barramento C (Linhas de controle de 1 bit) ---
        this.mar = 0;
        this.mbr = 0;
        this.pc  = 0;
        this.ac  = 0;
        this.y   = 0;
        this.sp  = 0;

        // --- Sinais de Controle da ULA (6 bits) ---
        this.f0   = 0;
        this.f1   = 0;
        this.ena  = 0;
        this.enb  = 0;
        this.inva = 0;
        this.inc  = 0;

        // --- Sinais de Controle do Shifter (Deslocador - 2 bits) ---
        this.sll8 = 0; 
        this.sra1 = 0; 

        // --- Seletor do Barramento B (IDs: 1=PC, 2=AC, 3=SP, 7=MBR) ---
        this.bbus = 0; 

        // --- Controle de Memória RAM (2 bits) ---
        this.read  = 0;
        this.write = 0;

        // --- Lógica de Micro-sequenciamento (Desvios e Próximo Endereço) ---
        this.jamz        = 0;
        this.jamn        = 0;
        this.jmpc        = 0;
        this.nextAddress = 0; // Endereço base de 9 bits para a próxima microinstrução
    }

    // Método para atualizar o MIR com os bits da nova microinstrução carregada
    carregar(bits) {
        // Rótulo
        this.label = bits.label ?? "";

        // Sinais do Barramento C
        this.mar = bits.mar ?? 0;
        this.mbr = bits.mbr ?? 0;
        this.pc  = bits.pc  ?? 0;
        this.ac  = bits.ac  ?? 0;
        this.y   = bits.y   ?? 0;
        this.sp  = bits.sp  ?? 0;

        // Sinais da ULA
        this.f0   = bits.f0   ?? 0;
        this.f1   = bits.f1   ?? 0;
        this.ena  = bits.ena  ?? 0;
        this.enb  = bits.enb  ?? 0;
        this.inva = bits.inva ?? 0;
        this.inc  = bits.inc  ?? 0;
        
        // Sinais do Shifter
        this.sll8 = bits.sll8 ?? 0;
        this.sra1 = bits.sra1 ?? 0;
        
        // Código do Barramento B
        this.bbus = bits.bbus ?? 0;

        // Sinais de controle da RAM externa
        this.read  = bits.read  ?? 0;
        this.write = bits.write ?? 0;

        // Sinais do Sequenciador
        this.jamz        = bits.jamz        ?? 0;
        this.jamn        = bits.jamn        ?? 0;
        this.jmpc        = bits.jmpc        ?? 0;
        this.nextAddress = bits.nextAddress ?? 0;
    }
}

export default MicroInstructionRegister;