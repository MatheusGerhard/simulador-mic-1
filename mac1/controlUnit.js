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

//import Memory from './componentes/ram.js';
import memoria from "../processador/memory.js";

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
        this.ram = memoria;
        this.regs = new Registers();
        this.shifter = new Shifter();
        this.ramL = 0;
        this.ramE = 0;
        this.onEstadoChange = null;
        this.micro = null;
    }

    rodarCiclo(sc,ciclos) {
        switch(sc) {
            case(1): // Busca microinstrução
                const endereco = this.mpc.read();
                this.micro = this.cs.read(endereco);
                if (this.micro == null || this.micro == undefined) return false;

                this.mir.write(this.micro);
                console.log("MIR: "+this.mir.label.toUpperCase());

                break


            case(2): // Busca os operandos e leva aos latchs
                this.decA.write(this.mir.read("a"));
                this.decB.write(this.mir.read("b"));
                this.decC.write(this.mir.read("c"));

                const valorA = this.regs.read(this.decA.read());
                const valorB = this.regs.read(this.decB.read());

                this.latA.write(valorA);
                this.latB.write(valorB);

                console.log("lA: "+this.latA.read());
                console.log("lB: "+this.latB.read());

                break


            case(3): // Calculo na ALU e envio para MBR

                // ALU/Deslocador
                this.amux.write(this.latA.read(), this.mbr.read(), this.mir.read("amux"));
                this.amux.select();            
                console.log("amux: "+this.amux.read());
         
                this.alu.write(this.amux.read(), this.latB.read(), this.mir.read("alu"))
                this.alu.calcular();

                this.shifter.write(this.alu.read("res"), this.mir.read("sh"));
                this.shifter.deslocar();
                console.log("alu/shi: "+this.shifter.read());


                // Leitura da RAM
                // 1. flag caso já tenha pedido algo
                if (this.ramL) {
                    const data = this.ram.read(this.mar.read());
                    this.mbr.write(data);
                    console.log("ram->mbr: "+this.mbr.read());

                    this.ramL = 0;
                }
                else if (this.ramE) {
                    this.ram.write(this.mar.read(), this.mbr.read());
                    this.ramE = 0;
                }

                // 2. Nova leitura
                if (this.mir.read("rd") == "1") {
                    if (this.mir.read("mar") == "1") {
                        this.mar.write(this.latB.read());
                        this.ramL = 1;
                        
                        console.log("mar pede: "+this.mar.read());
                    }
                }
                // 3. Nova Escrita
                if (this.mir.read("wr") == "1") {
                    if (this.mir.read("mbr") == "1") {
                        this.mar.write(this.latB.read());
                        this.mbr.write(this.shifter.read());
                        this.ramE = 1;
                        console.log("mar: "+this.mar.read());
                        console.log("shi->mbr: "+this.mbr.read());
                        console.log("mbr Envia: "+this.mbr.read()+" para:"+this.mar.read());
                    }
                }

                break


            case(4): // Escrita dos resultados e Próxima instrução
                if (this.mir.read("enc") == "1") {
                    this.regs.write(this.decC.read(), this.shifter.read());
                    // console.log("pc: "+this.regs.read(0));
                    console.log("ac: "+this.regs.read(1));
                    console.log("sp: "+this.regs.read(2));
                    console.log("ir: "+this.regs.read(3));
                    console.log("tir: "+this.regs.read(4));
                }

                this.msl.write(this.alu.read("Z"), this.alu.read("N"), this.mir.read("cond"));
                this.msl.calcula();
                console.log("msl: "+this.msl.read());

                this.increm.write(this.mpc.read())
                this.increm.increment();

                this.mmux.write(this.increm.read(), this.mir.read("addr"), this.msl.read());
                this.mmux.select();
                // console.log("MMUX:"+this.mmux.read());

                this.mpc.write(this.mmux.read());
                // console.log("mpc:"+this.mpc.read());

                break
        }
        
        if (this.onEstadoChange) {
            this.onEstadoChange(this.getEstado(sc,ciclos));
        }


        return true;
    }

    pausarCiclo(){
        this.clock.pausar();
    }

    reset() {
        this.alu = new ArithmeticLogicUnit();
        this.amux = new Amux();
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
        this.regs = new Registers();
        this.shifter = new Shifter();
        this.tempV = "0";
        this.tempE = "0";
        this.micro = null;
        
    }

    // Funções de integração com a interface (React)
    setCallback(callback) {
        this.onEstadoChange = callback;
    }

    // Método que monta o snapshot completo do estado atual
    getEstado(sc,ciclos) {
        return {
            subciclo:  sc,
            ciclos:    ciclos,
            mir:       this.mir.label,
            mpc:       this.mpc.read(),
            mar:       this.mar.read(),
            mbr:       this.mbr.read(),
            aluRes:    this.alu.read("res"),
            aluZ:      this.alu.read("Z"),
            aluN:      this.alu.read("N"),
            latA:      this.latA.read(),
            latB:      this.latB.read(),
            amux:      this.amux.read(),
            shifter:   this.shifter.read(),
            mmux:      this.mmux.read(),
            msl:       this.msl.read(),
            pc:        this.regs.read(0),
            ac:        this.regs.read(1),
            sp:         this.regs.read(2),
            ir:        this.regs.read(3),
            tir:       this.regs.read(4),
            zero:      this.regs.read(5),
            um:        this.regs.read(6),
            menosUm:   this.regs.read(7),
            am:        this.regs.read(8),
            sm:        this.regs.read(9),
            regA:      this.regs.read(10),
            regB:      this.regs.read(11),
            regC:      this.regs.read(12),
            regD:      this.regs.read(13),
            regE:      this.regs.read(14),
            regF:      this.regs.read(15),
            decA:      this.decA.read(),
            decB:      this.decB.read(),
            decC:      this.decC.read(),
        };
    }
}

export default ControlUnit;