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

        this.micro = null;
    }

    rodarCiclo(sc) {
        switch(sc) {
            case(1): // Busca microinstrução
                const endereco = this.mpc.read();
                this.micro = this.cs.read(endereco);
                if (this.micro == null || this.micro == undefined) return false;

                this.mir.write(this.micro);

                break


            case(2): // Busca os operandos e leva aos latchs
                this.decA.write(this.mir.read("a"));
                this.decB.write(this.mir.read("b"));
                this.decC.write(this.mir.read("c"));

                this.latA.write(this.regs.read(parseInt(this.decA.read(), 2)));
                this.latB.write(this.regs.read(parseInt(this.decB.read(), 2)));

                this.increm.increment();

                break


            case(3): // Envio MAR/MBR ou Calculo na ALU
                let valA = this.latA.read();
                let valB = this.latB.read();
                // console.log("lA:"+valA);
                // console.log("lB:"+valB);
                // console.log("pc: "+this.regs.read(0));

                // MAR/MBR
                if (this.mir.read("mbr") == "1") {
                    if (this.mir.read("rd") == "1") {
                        const data = this.memory.read(parseInt(this.mar.read(), 2));
                        this.mbr.write(data);
                        console.log("mbr:"+this.mbr.read());
                    }
                    if (this.mir.read("wr") == "1") {
                        const data = this.mbr.read();
                        const marVal = this.mar.read();
                        this.memory.write(data, this.mar.read());
                    }
                }
                
                if (this.mir.read("mar") == "1") {
                    this.mar.write(valB);
                    console.log("mar:"+this.mar.read());
                }
                

                // ALU/Deslocador
                this.amux.write(valA, this.mbr.read(), this.mir.read("amux"));
                this.amux.select();
                const amuxVal = this.amux.read();
                
                // console.log("amux: "+amuxVal);
         
                this.alu.write(amuxVal, valB, this.mir.read("alu"))
                this.alu.calcular();
                console.log("alu:"+this.alu.read("res"));
                console.log("ir:"+this.regs.read(3));

                this.shifter.write(this.alu.read("res"), this.mir.read("sh"));
                this.shifter.deslocar();

                // console.log("shi: "+this.shifter.read());
                
                this.msl.write(this.alu.read("Z"), this.alu.read("N"), this.mir.read("cond"));
                this.msl.calcula();
            
                break


            case(4): // Escrita dos resultados e Próxima instrução                
                if (this.mir.read("enc") == "0" && this.mir.read("mbr") == "1") {
                    this.mbr.write(this.shifter.read());
                }
                if (this.mir.read("enc") == "1") {
                    this.regs.write(parseInt(this.mir.read("c"), 2), this.shifter.read());
                }
                console.log("ir:"+this.regs.read(3));

                this.increm.write(this.mpc.read())
                this.increm.increment();
                this.mmux.write(this.increm.read(), this.mir.read("addr"), this.msl.read());
                this.mmux.select();
                this.mpc.write(this.mmux.read());
                console.log(this.mmux.read());
                console.log("mpc:"+this.mpc.read());

                break
        }

        return true;
    }
}

export default ControlUnit;