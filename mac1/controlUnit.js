// Importações
import Amux from './componentes/amux.js';
import ArithmeticLogicUnit from './componentes/alu.js';
import Clock from './componentes/clock.js';
import ControlStore from './componentes/cs.js';
import DecoderC from './componentes/decoderC.js';
import DecoderB from './componentes/decoderB.js';
import DecoderA from './componentes/decoderA.js';
import Increment from './componentes/increment.js';
import LatchA from './componentes/latchA.js';
import LatchB from './componentes/latchB.js';
import MAR from './componentes/mar.js';
import MBR from './componentes/mbr.js';
import Memory from './componentes/ram.js';
import MicroInstructionRegister from './componentes/mir.js';
import MicroprogramCounter from './componentes/mpc.js';
import Mmux from './componentes/mmux.js';
import MSL from './componentes/msl.js';
import Registers from './componentes/registers.js';
import Shifter from './componentes/shifter.js';


class ControlUnit {
    constructor() {
        this.alu = new ArithmeticLogicUnit();
        this.amux = new Amux();
        this.clock = new Clock();
        this.cs = new ControlStore();
        this.increm = new Increment();
        this.decC = new DecoderC();
        this.decB = new DecoderB();
        this.decA = new DecoderA();
        this.latA = new LatchA();
        this.latB = new LatchB();
        this.mar = new MAR();
        this.mbr = new MBR();
        this.memory = new Memory();
        this.mir = new MicroInstructionRegister();
        this.mmux = new Mmux();
        this.mpc = new MicroprogramCounter();
        this.msl = new MSL();
        this.regs = new Registers();
        this.shifter = new Shifter();
    }

    rodarCiclo(sc) {
        switch(sc) {
            case(1): // Busca microinstrução
                const endereco = this.mpc.read();
                const micro = this.cs.read(endereco);
                if (!micro) return false;

                this.mir.write(micro);

                break


            case(2): // Busca os operandos e leva aos latchs
                this.decA.write(this.mir.read("a"));
                this.decB.write(this.mir.read("b"));
                this.decC.write(this.mir.read("c"));
                
                this.latA.write(this.regs.read(this.decA.read()));
                this.latB.write(this.regs.read(this.decB.read()));

                this.increm.increment();

                break


            case(3): // Envio MAR/MBR ou Calculo na ALU
                let valA = this.latA.read();
                let valB = this.latB.read();

                // MAR/MBR
                if (this.mir.read("mbr") === "1") {
                    if (this.mir.read("rd") === "1") {
                        const data = this.memory.read(this.mar.read());
                        this.mbr.write(data);
                        
                    }
                    if (this.mir.read("wr") === "1") {
                        const data = this.mbr.read();
                        const marVal = this.mar.read();
                        this.memory.write(data, this.mar.read());
                    }
                }
                
                if (this.mir.read("mar") === "1") {
                    this.mar.write("mar", valB);
                }
                

                // ALU/Deslocador
                amuxVal = this.amux.select(valA, this.mbr.read(), this.mir.read("amux"));

                const resALU = this.alu.calcular(amuxVal, valB, this.mir.read("alu"));
                const resFinal = this.shifter.deslocar(resALU, this.mir.read("sh"));
                
                this.msl.write(this.alu.getZ(), this.alu.getN(), this.mir.read("cond"));
            
                break


            case(4): // Escrita dos resultados e Próxima instrução                
                if (this.mir.read("enc") === "0") {
                    this.regs.write(this.decC.read(), resFinal);
                }
                if (this.mir.read("enc") === "1") {
                    this.mbr.write(resFinal);
                }

                incVal = this.increm.increment(this.mpc.read());
                const mmuxVal = this.mmux.select(incVal, this.mir.read("addr"), this.msl.read());
                this.mpc.write(mmuxVal);

                break
        }

        return true;
    }
}

export default ControlUnit;