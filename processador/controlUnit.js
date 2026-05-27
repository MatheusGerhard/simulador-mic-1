// Control Unit - Unidade de Controle (ControlUnit)

// Descrição: O "cérebro" do processador. Decodifica instruções e coordena o fluxo de dados.
// Recebe: O opcode vindo do IR e sinais de flags da ALU.
// Envia: Sinais de controle (Enable, Read, Write, Select ALU Op) para todos os outros componentes.

class ControlUnit {
    // O constructor recebe as peças (objetos) de hardware que vai controlar
    constructor(mpc, memoria, pc, mar, mbr, ir) {
        this.mpc = mpc;
        this.memoria = memoria;
        this.pc = pc;
        this.mar = mar;
        this.mbr = mbr;
        this.ir = ir;
    }

    // O ciclo se inicia
    rodaCiclo() {
        switch (this.mpc.read()) {
            case 0:
                this.mar.write(this.pc.read());
                this.mbr.write(this.memoria.read(this.mar.read()));
                
                // CORREÇÃO: Atualizamos o valor usando .write()
                this.mpc.write(1); 
                break;

            case 1:
                this.pc.increment();
                this.mbr.write(this.memoria.read(this.mar.read()));
                
                this.mpc.write(2); 
                break;

            case 2:
                this.ir.write(this.mbr.read());                
                this.mpc.write(0); 
                break;
        }
    }
}

export default ControlUnit;