// Importações
import Amux from '../mac1/componentes/amux.js';
import ArithmeticLogicUnit from '../mac1/componentes/alu.js';
import Cache from '../mac2/componentes/cache.js';
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


class ControlUnit {
    constructor() {
        // classes
        this.alu = new ArithmeticLogicUnit();
        this.amux = new Amux();
        this.cache = new Cache();
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

        // pipeline
        this.memoryBusy = 0;
        this.estagios = [];
        this.reset = 0;
        this.pipeline = {
            IF_ID: {mir: null},
            ID_EX: {mir: null},
            EX_MEM: {mir: null},
            MEM_WB: {mir: null}
        };
    }

    // O loop principal (do final para o início para evitar atropelos)
    rodarCiclo(ciclos) {
        // ciclos iniciais
        switch(this.reset) {
            case(0):
            this.reset++;
            this.estagios = [1];
            break;

            case(1):
            this.reset++;
            this.estagios = [1,2];
            break;

            case(2):
            this.reset++;
            this.estagios = [1,2,3];
            break;

            case(3):
            this.reset++;
            this.estagios = [1,2,3,4];
            break;

            default:
            this.estagios = [1,2,3,4,5];
            break;
        }

        // Verifica se o estágio MEM está ocupado
        if (this.memoryBusy) {
            this.estagios = []
            console.log("Aguarde o cache.");
            this.memoryBusy = 0;
        }

        if (this.estagios.includes(1)) {
            this.estagioIF();
        }
        if (this.estagios.includes(2)) {
            this.estagioID();
        }
        if (this.estagios.includes(3)) {
            this.estagioEX();
        }
        if (this.estagios.includes(4)) {
            this.estagioMEM();
        }
        if (this.estagios.includes(5)) {
            this.estagioWB();
        }


        if (this.onEstadoChange) {
            this.onEstadoChange(this.getEstado(null, ciclos));
        }
        return true;
    }

    // IF (Instruction Fetch): Busca a instrução.
    estagioIF() {
        const micro = this.cs.read(this.mpc.read());

        const mirInstance = new MicroInstructionRegister();
        mirInstance.write(micro);

        this.pipeline.IF_ID = {mir: mirInstance};
        console.log("IF: addr: "+this.mpc.read()+", micro: "+mirInstance.label)
    }

    // ​ID (Instruction Decode): Decodifica a instrução e lê os registradores.
    estagioID() {
        const buffer = this.pipeline.IF_ID;
        if (!buffer || !buffer.mir) return;

        const mir = buffer.mir;
        this.decA.write(mir.read("a"));
        this.decB.write(mir.read("b"));

        this.latA.write(this.regs.read(this.decA.read()));
        this.latB.write(this.regs.read(this.decB.read()));

        if (this.mir.read("mar") == "1") {
            this.mar.write(this.latB.read());
            console.log("mar recebe: "+this.mar.read());

            if (this.mir.read("rd") == "1") {
                let data = this.cache.read(this.mar.read());
                if (data == null) {
                    this.misses++;
                    this.memoryBusy = 1;
                }
                else {
                    this.mbr.write(data);
                    this.hits++;
                    console.log("cache->mbr: "+this.mbr.read());
                }
            }
        }
        
        this.amux.write(this.latA.read(), this.mbr.read(), mir.read("amux"));
        this.amux.select();

        this.pipeline.ID_EX = {mir};
        console.log("ID: mir: "+mir.label+", amux: "+this.amux.read()+", latB: "+this.latB.read())
    }

    // ​EX (Execute): Realiza a operação aritmética/lógica na ULA (ALU).
    estagioEX() {
        const buffer = this.pipeline.ID_EX;
        if (!buffer || !buffer.mir) return;

        const mir = buffer.mir;

        this.alu.write(this.amux.read(), this.latB.read(), mir.read("alu"));
        this.alu.calcular();

        this.shifter.write(this.alu.read("res"), mir.read("sh"));
        this.shifter.deslocar();

        this.pipeline.EX_MEM = {mir};
        console.log("EX: mir: "+mir.label+", res: "+this.shifter.read())

        // Saltos
        this.msl.write(this.alu.read("Z"), this.alu.read("N"), mir.read("cond"));
        this.msl.calcula();

        if (this.msl.read()==1) {
            this.reset = 0;
        }

        this.increm.write(this.mpc.read());
        this.increm.increment();

        this.mmux.write(this.increm.read(), mir.read("addr"), this.msl.read());
        this.mmux.select();

        this.mpc.write(this.mmux.read());

        console.log("msl: "+this.msl.read()+" - goto: "+this.mpc.read());
    }

    // ​MEM (Memory Access): Acesso à memória de dados (se necessário).
    estagioMEM() {
        const buffer = this.pipeline.EX_MEM;
        if (!buffer || !buffer.mir) return;

        const mir = buffer.mir;

        if (mir.read("mbr") == "1") {
            this.mbr.write(this.shifter.read());
            console.log("shi->mbr: "+this.mbr.read());
            if (mir.read("wr") == "1") {
                this.cache.write(this.mar.read(), this.mbr.read());
                // this.memoryBusy = 1;
                console.log("mbr->cache: "+this.mbr.read()+': '+this.mar.read());
            }
        }

        this.pipeline.MEM_WB = {mir};
        console.log("MEM: mir: "+mir.label+", wr: "+mir.read("wr"))
    }

    // ​WB (Write Back): Grava o resultado de volta no banco de registradores
    estagioWB() {
        const buffer = this.pipeline.MEM_WB;
        if (!buffer || !buffer.mir) return;

        const mir = buffer.mir;

        this.decC.write(mir.read("c"));

        if (mir.read("enc") == "1") {
            this.regs.write(this.decC.read(), this.shifter.read());
        }

        console.log("WB: mir: "+mir.label+", enc: "+mir.read("enc")+", reg: "+this.decC.read())
    }

    pausarCiclo(){
        this.clock.pausar();
    }

    reset() {
        // classes
        this.alu = new ArithmeticLogicUnit();
        this.amux = new Amux();
        this.cache = new Cache();
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