// Importações
import Amux from './componentes/amux.js';
import ArithmeticLogicUnit from './componentes/alu.js';
import ControlStore from './componentes/cs.js';
import DecoderC from './componentes/decoderC.js';
import DecoderB from './componentes/decoderB.js';
import DecoderA from './componentes/decoderA.js';
import Increment from './componentes/increment.js';
import LatchA from './componentes/latchA.js';
import LatchB from './componentes/latchB.js';
import MAR from './componentes/mar.js';
import MBR from './componentes/mbr.js';
import memoria from "./componentes/memory.js";
import MicroInstructionRegister from './componentes/mir.js';
import MicroprogramCounter from './componentes/mpc.js';
import Mmux from './componentes/mmux.js';
import MSL from './componentes/msl.js';
import Registers from './componentes/registers.js';
import Shifter from './componentes/shifter.js';
import { logInstructionExecution } from '../src/services/simulationLog.js';

const LOCAL_ADDRESS_LABELS = new Set(["lodl1", "stol1", "addl1", "subl1"]);

function andWords(left, right) {
    return left
        .split("")
        .map((bit, index) => (bit == "1" && right[index] == "1" ? "1" : "0"))
        .join("");
}


class ControlUnit {
    constructor() {
        this.breakpoints = new Set();
        // classes
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
        this.ram = memoria;
        this.regs = new Registers();
        this.shifter = new Shifter();

        // variáveis
        this.onEstadoChange = null;
        this.micro = null;
        this.ramL = 0;
        this.ramE = 0;
        this.hits = 0;
        this.misses = 0;

    }

    rodarCiclo(sc,ciclos) {
        switch(sc) {
            case(1): // Busca microinstrução
                var endereco = this.mpc.read();
                if (endereco === 0) {
                    var programCounter = this.regs.read(0);
                    logInstructionExecution(programCounter, {
                        processor: "MAC-1",
                        executionKey: `${ciclos}:${sc}`,
                        cycle: ciclos,
                        cacheHits: this.hits,
                        cacheMisses: this.misses,
                        word: this.ram.read(programCounter),
                    });
                }
                this.micro = this.cs.read(endereco);
                if (this.micro == null || this.micro == undefined) return false;

                this.mir.write(this.micro);
                console.log("MIR - "+this.mpc.read()+": "+this.mir.label.toUpperCase());

                break


            case(2): // Ativando registradores: 16 + MAR + MBR
                this.decA.write(this.mir.read("a"));
                this.decB.write(this.mir.read("b"));
                this.decC.write(this.mir.read("c"));

                const valorA = this.regs.read(this.decA.read());
                let valorB = this.regs.read(this.decB.read());

                if (LOCAL_ADDRESS_LABELS.has(this.mir.label)) {
                    valorB = andWords(valorB, this.regs.read(8));
                }

                this.latA.write(valorA);
                this.latB.write(valorB);

                console.log("lA: "+this.latA.read());
                console.log("lB: "+this.latB.read());

                // Caso tenha pedido escrita, o dado chegou lá agora
                if (this.ramE > 0) {
                    this.ramE--;
                    if (this.ramE == 0) {                        
                        this.ram.write(this.mar.read(), this.mbr.read());
                    }
                }

                // MAR
                if (this.mir.read("mar") == "1") {
                    this.mar.write(this.latB.read());
                    console.log("mar recebe: "+this.mar.read());
                    if (this.mir.read("rd") == "1") {
                        this.ramL = 2;
                    }
                }

                break


            case(3): // Calculo na ALU
                this.amux.write(this.latA.read(), this.mbr.read(), this.mir.read("amux"));
                this.amux.select();            
                console.log("amux: "+this.amux.read());
         
                this.alu.write(this.amux.read(), this.latB.read(), this.mir.read("alu"))
                this.alu.calcular();

                this.shifter.write(this.alu.read("res"), this.mir.read("sh"));
                this.shifter.deslocar();
                console.log("alu/shi: "+this.shifter.read());

                break


            case(4): // Envio dos resultados para:
                // Registradores + MBR
                if (this.mir.read("enc") == "1") {
                    this.regs.write(this.decC.read(), this.shifter.read());
                    console.log("pc: "+this.regs.read(0));
                    console.log("ac: "+this.regs.read(1));
                    console.log("sp: "+this.regs.read(2));
                    console.log("ir: "+this.regs.read(3));
                    console.log("tir: "+this.regs.read(4));
                }
                else if (this.mir.read("mbr") == "1") {
                    this.mbr.write(this.shifter.read());
                    console.log("shi->mbr: "+this.mbr.read());
                }
                // RAM
                if (this.mir.read("wr") == "1" && this.ramE == 0) {
                    this.ramE = 2;
                    console.log("mbr Envia: "+this.mbr.read()+" para:"+this.mar.read());
                }
                // MBR (caso já tenha pedido algo antes)
                if (this.ramL > 0) {
                    this.ramL--;
                    if (this.ramL == 0) {
                        const data = this.ram.read(this.mar.read());
                        this.mbr.write(data);
                        console.log("ram->mbr: "+this.mbr.read());
                    }
                }


                // Próxima instrução
                this.msl.write(this.alu.read("Z"), this.alu.read("N"), this.mir.read("cond"));
                this.msl.calcula();

                this.increm.write(this.mpc.read())
                this.increm.increment();

                this.mmux.write(this.increm.read(), this.mir.read("addr"), this.msl.read());
                this.mmux.select();

                this.mpc.write(this.mmux.read());

                console.log("msl: "+this.msl.read()+" - goto: "+this.mpc.read());

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
        // classes
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
        this.ram = memoria;
        this.regs = new Registers();
        this.shifter = new Shifter();

        // variáveis
        this.micro = null;
        this.ramL = 0;
        this.ramE = 0;
        this.hits = 0;
        this.misses = 0;

        if (this.onEstadoChange) {
            this.onEstadoChange(this.getEstado(1,0));
        }
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
