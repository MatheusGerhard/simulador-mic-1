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
        this.mir = new MicroInstructionRegister();
        this.mmux = new Mmux();
        this.mpc = new MicroprogramCounter();
        this.msl = new MSL();
        this.ram = new Memory();
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
                console.log("mir:"+this.mir.label);

                break


            case(2): // Busca os operandos e leva aos latchs
                this.decA.write(this.mir.read("a"));
                this.decB.write(this.mir.read("b"));
                this.decC.write(this.mir.read("c"));

                this.latA.write(this.regs.read(this.decA.read()));
                this.latB.write(this.regs.read(this.decB.read()));

                console.log("lA:"+this.latA.read());
                console.log("lB:"+this.latB.read());
                this.increm.increment();

                break


            case(3): // Envio MAR/MBR ou Calculo na ALU

                // MAR/MBR
                if (this.mir.read("mbr") == "1") {
                    if (this.mir.read("wr") == "0") {
                        const data = this.ram.read(parseInt(this.mar.read(), 2));
                        this.mbr.write(data);
                        console.log("mbr:"+this.mbr.read());
                    }
                    if (this.mir.read("wr") == "1") {
                        const data = this.mbr.read();
                        const marVal = this.mar.read();
                        this.ram.write(data, this.mar.read());
                        console.log("ram:"+this.ram.read(this.mar.read()));
                    }
                }
                
                if (this.mir.read("mar") == "1") {
                    this.mar.write(this.latB.read());
                    console.log("mar:"+this.mar.read());
                }
                

                // ALU/Deslocador
                this.amux.write(this.latA.read(), this.mbr.read(), this.mir.read("amux"));
                this.amux.select();            
                console.log("amux: "+this.amux.read());
         
                this.alu.write(this.amux.read(), this.latB.read(), this.mir.read("alu"))
                this.alu.calcular();
                console.log("alu:"+this.alu.read("res"));
                console.log("pc:"+this.regs.read(0));
                console.log("ir:"+this.regs.read(3));

                this.shifter.write(this.alu.read("res"), this.mir.read("sh"));
                this.shifter.deslocar();
                if (this.shifter.read() == "0000000000000000") 
                console.log("shi: "+this.shifter.read());
                
                break


            case(4): // Escrita dos resultados e Próxima instrução
                if (this.mir.read("enc") == "0" && this.mir.read("mbr") == "1") {
                    this.mbr.write(this.shifter.read());
                }
                if (this.mir.read("enc") == "1") {
                    this.regs.write(this.decC.read(), this.shifter.read());                    
                    console.log("pc:"+this.regs.read(0));
                    console.log("ir:"+this.regs.read(3));
                    console.log("tir:"+this.regs.read(4));
                }

                this.msl.write(this.alu.read("Z"), this.alu.read("N"), this.mir.read("cond"));
                this.msl.calcula();
                console.log("msl:"+this.msl.read());

                this.increm.write(this.mpc.read())
                this.increm.increment();

                this.mmux.write(this.increm.read(), this.mir.read("addr"), this.msl.read());
                this.mmux.select();
                console.log("mmux:"+this.mmux.read());

                this.mpc.write(this.mmux.read());
                console.log("mpc:"+this.mpc.read());

                break
        }

        return true;
    }
}

export default ControlUnit;