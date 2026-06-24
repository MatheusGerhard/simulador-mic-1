// Importações
import Amux from '../mac1/componentes/amux.js';
import ArithmeticLogicUnit from '../mac1/componentes/alu.js';
import Cache from './componentes/cache.js';
import ControlStore from './componentes/cs.js';
import DecoderC from '../mac1/componentes/decoderC.js';
import DecoderB from '../mac1/componentes/decoderB.js';
import DecoderA from '../mac1/componentes/decoderA.js';
import Increment from '../mac1/componentes/increment.js';
import LatchA from '../mac1/componentes/latchA.js';
import LatchB from '../mac1/componentes/latchB.js';
import MAR from '../mac1/componentes/mar.js';
import MBR from '../mac1/componentes/mbr.js';
import memoria from "../mac1/componentes/memory.js";
import MicroInstructionRegister from '../mac1/componentes/mir.js';
import MicroprogramCounter from '../mac1/componentes/mpc.js';
import Mmux from '../mac1/componentes/mmux.js';
import MSL from '../mac1/componentes/msl.js';
import Registers from '../mac1/componentes/registers.js';
import Shifter from '../mac1/componentes/shifter.js';
import { logInstructionExecution } from '../src/services/simulationLog.js';

const DEFAULT_CACHE_SIZE = 3;

function normalizeCacheSize(size) {
    const numericSize = Number.parseInt(size, 10);
    return Number.isFinite(numericSize) && numericSize >= 1
        ? numericSize
        : DEFAULT_CACHE_SIZE;
}

const LOCAL_ADDRESS_LABELS = new Set(["lodl1", "stol1", "addl1", "subl1"]);

function andWords(left, right) {
    return left
        .split("")
        .map((bit, index) => (bit == "1" && right[index] == "1" ? "1" : "0"))
        .join("");
}

class ControlUnit {
    constructor(cacheSize = DEFAULT_CACHE_SIZE) {
        this.cacheSize = normalizeCacheSize(cacheSize);
        // classes
        this.alu = new ArithmeticLogicUnit();
        this.amux = new Amux();
        this.cache = new Cache(this.cacheSize);
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
                        processor: "MAC-2",
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

                // MAR
                if (this.mir.read("mar") == "1") {
                    this.mar.write(this.latB.read());
                    console.log("mar recebe: "+this.mar.read());

                    if (this.mir.read("rd") == "1") {
                        let data = this.cache.read(this.mar.read());
                        if (data == null) {
                            this.misses++;
                            if (this.onEstadoChange) {
                                this.onEstadoChange(this.getEstado(sc,ciclos));
                            }
                            return false;
                        }
                        else {
                            this.mbr.write(data);
                            console.log("cache->mbr: "+this.mbr.read());
                            this.hits++;
                        }
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


            case(4): // Escrita dos resultados e Próxima instrução
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
                    this.cache.write(this.mar.read(), this.mbr.read());
                    console.log("mbr->cache: "+this.mbr.read()+": "+this.mar.read());
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
        this.cache = new Cache(this.cacheSize);
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
    setCacheSize(cacheSize) {
        this.cacheSize = normalizeCacheSize(cacheSize);
        this.cache = new Cache(this.cacheSize);
        this.cache.ram = this.ram;
    }

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
