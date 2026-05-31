import MicroprogramCounter from './componentes/mpc.js';
import ControlStore from './componentes/cs.js';
import MicroInstructionRegister from './componentes/mir.js';
import Registers from './componentes/registers.js';
import ArithmeticLogicUnit from './componentes/alu.js';
import Shifter from './componentes/shifter.js';
import MSL from './componentes/msl.js';
import Increment from './componentes/increment.js';
import Mmux from './componentes/mmux.js';
import DecoderB from './componentes/decoderB.js';
import DecoderC from './componentes/decoderC.js';
import Memory from './componentes/ram.js';

class ControlUnit {
    constructor() {
        this.mpc = new MicroprogramCounter();
        this.cs = new ControlStore();
        this.mir = new MicroInstructionRegister();
        this.regs = new Registers();
        this.alu = new ArithmeticLogicUnit();
        this.shifter = new Shifter();
        this.msl = new MSL();
        this.incrementer = new Increment();
        this.mmux = new Mmux();
        this.decB = new DecoderB();
        this.decC = new DecoderC();
        this.memory = new Memory();
    }

    rodarCiclo() {
        // Busca microinstrução
        const endereco = this.mpc.read();
        const micro = this.cs.read(endereco);
        if (!micro) return false;

        this.mir.write(micro);

        // 1. Barramento B
        this.decB.write(this.mir.read("b"));
        const regBName = this.decB.read();
        const valB = this.regs.read(regBName) || "0000000000000000";
        const valH = this.regs.read("h") || "0000000000000000";

        // 2. ALU e Shifter
        const resALU = this.alu.calcular(valH, valB, this.mir.read("alu"));
        const resFinal = this.shifter.deslocar(resALU, this.mir.read("sh"));
        
        this.msl.write(this.alu.getZ(), this.alu.getN());

        // 3. Barramento C (Escrita baseada nos sinais do MIR)
        if (this.mir.read("mar") === "1") {
            this.regs.write("mar", resFinal);
        }
        if (this.mir.read("mbr") === "1") {
            this.regs.write("mbr", resFinal);
        }
        
        // Decodifica destino extra (PC, AC, SP...)
        this.decC.write(this.mir.read("c"));
        const regCName = this.decC.read();
        if (regCName !== "none") {
            this.regs.write(regCName, resFinal);
        }

        // 4. Operações de Memória (Sinais individuais rd/wr)
        const marVal = parseInt(this.regs.read("mar") || "0", 2);
        
        if (this.mir.read("rd") === "1") { 
            const data = this.memory.read(marVal) || "0000000000000000";
            this.regs.write("mbr", data);
        }
        if (this.mir.read("wr") === "1") {
            this.memory.write(marVal, this.regs.read("mbr"));
        }

        // 5. Sequenciamento do Próximo Endereço
        const jumpAddrBin = this.mir.read("addr");
        const proximo = parseInt(jumpAddrBin, 2);
        
        this.mpc.write(proximo);

        return true;
    }
}
export default ControlUnit;