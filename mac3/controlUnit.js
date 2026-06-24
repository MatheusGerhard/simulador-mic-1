// Importações
import Amux from '../mac1/componentes/amux.js';
import ArithmeticLogicUnit from '../mac1/componentes/alu.js';
import Cache from '../mac2/componentes/cache.js';
import ControlStore from './componentes/cs.js';
import DecoderI from './componentes/decoderI.js';
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

class ControlUnit {
    constructor(cacheSize = DEFAULT_CACHE_SIZE) {
        this.cacheSize = normalizeCacheSize(cacheSize);

        // classes
        this.alu = new ArithmeticLogicUnit();
        this.amux = new Amux();
        this.cache = new Cache(this.cacheSize);
        this.cs = new ControlStore();
        this.decI = new DecoderI();
        this.decC = new DecoderC();
        this.decB = new DecoderB();
        this.decA = new DecoderA();
        this.increm = new Increment();
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
        this.dh = 0;
        this.dhOn = 0;
        this.irTemp = null;
        this.memoryBusy = 0;
        this.pipeline = {
            IF_ID: {ir: null},
            ID_EX: {mir: null},
            EX_MA: {mir: null},
            MA_WB: {mir: null}
        };
    }

// O loop principal (do final para o início para evitar atropelos)
rodarCiclo(ciclos) {
    this.estagioWB();
    if (this.dhOn == 2) {
    console.log("Data Hazzard "+this.dhOn+": "+this.dh);
        switch (this.dh) {
            case(1):
                this.dh--;
                this.dhOn = 0;
                this.pipeline.MA_WB.mir = null;
                console.log("\n----- MA -----");
                console.log("----- EX -----");
                console.log("----- ID -----");
                console.log("----- IF -----");
                break;
            case(2):
                this.estagioMA();
                this.dh--;
                this.pipeline.EX_MA.mir = null;
                this.pipeline.ID_EX.mir = null;
                console.log("\n----- EX -----");
                console.log("----- ID -----");
                console.log("----- IF -----");
                break;
        }
    }
    else if (this.dhOn == 4) {
    console.log("Data Hazzard "+this.dhOn+": "+this.dh);
        switch (this.dh) {
            case(1):
                this.pipeline.MA_WB.mir = null;
                this.estagioMA();
                this.estagioEX();
                if(this.estagioID()) return true;
                this.estagioIF();
                this.dh--;
                this.dhOn = 0;
                break;
            case(2):
                this.estagioMA();
                this.dh--;
                this.pipeline.EX_MA.mir = null;
                this.pipeline.ID_EX.mir = null;
                console.log("\n----- EX -----");
                console.log("----- ID -----");
                console.log("----- IF -----");
                break;
            case(3):
                this.estagioMA();
                this.estagioEX();
                this.dh--;
                this.pipeline.ID_EX.mir = null;
                console.log("----- ID -----");
                console.log("----- IF -----");
                break;
            case(4):
                this.estagioMA();
                this.estagioEX();
                if(this.estagioID()) return true;
                this.pipeline.IF_ID.ir = null;
                this.dh--;
                console.log("----- IF -----");
                break;
        }
    }
    else if (this.dhOn == 11) {
    console.log("Data Hazzard "+this.dhOn+": "+this.dh);
        switch (this.dh) {
            case(1):
                this.pipeline.MA_WB.mir = null;
                console.log("----- WB -----");
                console.log("----- MA -----");
                console.log("----- EX -----");
                console.log("----- ID -----");
                this.estagioID();
                this.dh--;
                this.dhOn = 0;
                break;
            case(2):
                console.log("----- WB -----");
                this.estagioMA();
                this.pipeline.EX_MA.mir = null;
                this.pipeline.IF_ID.ir = null;
                this.dh--;
                console.log("----- EX -----");
                console.log("----- ID -----");
                console.log("----- IF -----");
                break;
            case(3):
                console.log("----- WB -----");
                console.log("----- MA -----");
                this.estagioEX();
                this.pipeline.ID_EX.mir = null;
                this.dh--;
                console.log("----- ID -----");
                console.log("----- IF -----");
                break;
            case(4):
                this.pipeline.MA_WB.mir = null;
                this.decI.write("1111111100100000");
                console.log("----- MA -----");
                console.log("----- EX -----");
                if(this.estagioID()) return true;
                this.dh--;
                console.log("----- IF -----");
                break;
            case(5):
                console.log("----- WB -----");
                this.estagioMA();
                this.pipeline.EX_MA.mir = null;
                this.dh--;
                console.log("----- EX -----");
                console.log("----- ID -----");
                console.log("----- IF -----");
                break;
            case(6):
                console.log("----- WB -----");
                console.log("----- MA -----");
                this.estagioEX();
                this.pipeline.ID_EX.mir = null;
                this.dh--;
                console.log("----- ID -----");
                console.log("----- IF -----");
                break;
            case(7):
                this.pipeline.MA_WB.mir = null;
                this.irTemp = this.pipeline.IF_ID.ir;
                this.decI.write("1111111100010000");
                console.log("----- MA -----");
                console.log("----- EX -----");
                if(this.estagioID()) return true;
                this.dh--;
                console.log("----- IF -----");
                break;
            case(8):
                console.log("----- WB -----");
                this.estagioMA();
                this.pipeline.EX_MA.mir = null;
                this.dh--;
                console.log("----- EX -----");
                console.log("----- ID -----");
                console.log("----- IF -----");
                break;
            case(9):
                console.log("----- WB -----");
                console.log("----- MA -----");
                this.estagioEX();
                this.pipeline.ID_EX.mir = null;
                this.dh--;
                console.log("----- ID -----");
                console.log("----- IF -----");
                break;
            case(10):
                this.pipeline.MA_WB.mir = null;
                console.log("----- MA -----");
                console.log("----- EX -----");
                if(this.estagioID()) return true;
                this.dh--;
                console.log("----- IF -----");
                break;
            case(11):
                console.log("----- WB -----");
                this.estagioMA();
                this.pipeline.EX_MA.mir = null;
                this.pipeline.ID_EX.mir = null;
                this.dh--;
                console.log("----- EX -----");
                console.log("----- ID -----");
                console.log("----- IF -----");
                break;
        }
    }
    else {
        if (this.memoryBusy == 0) {
            this.estagioMA();
            this.estagioEX();
            if(this.estagioID()) return true;
            this.estagioIF();
        }
        else if (this.memoryBusy == 1) {
            this.estagioMA();
            this.estagioEX();
            if(this.estagioID()) return true;
            console.log("----- IF -----");
            console.log("Stall: Aguardando Cache...");
            this.memoryBusy = 0;
        }
        else if (this.memoryBusy == 2) {
            this.estagioMA();
            this.estagioEX();
            console.log("----- ID -----");
            console.log("Stall: Aguardando Cache...");
            console.log("----- IF -----");
            this.memoryBusy = 0;
        }
        else if (this.memoryBusy == 4) {
            console.log("Stall: Aguardando Cache...");
            console.log("----- EX -----");
            console.log("----- ID -----");
            console.log("----- IF -----");
            this.memoryBusy = 0;
        }

        if (this.onEstadoChange) {
            this.onEstadoChange(this.getEstado(null, ciclos));
        }
    }
    
    return true;
}

    dataHazzard(mir) {
        if (mir!=null) {
            // 2 - dependência de dados
            if (this.pipeline.EX_MA.mir!=null && ((mir.a == this.pipeline.EX_MA.mir.c) || (mir.b == this.pipeline.EX_MA.mir.c))) {
                console.log("\n///// DATA HAZARD ///// Dependencia de dados /////\n")
                this.dh = 2;
                this.dhOn = 2;
                return true;
            }
            // 4 - escrita na memória - o mar precisa ficar estável
            else if (mir.wr == "1") { 
                console.log("\n///// DATA HAZARD ///// Espere a escrita /////\n")
                this.dh = 4;
                this.dhOn = 4;                
                return true;
            }
            else if (mir.label == "subd") { 
                console.log("\n///// DATA HAZARD ///// Espere: múltiplos ciclos /////\n")
                this.dh = 11;
                this.dhOn = 11;                
                return true;
            }
        }
    }

    // IF (Instruction Fetch): Busca a instrução e incrementa o pc.
    estagioIF() {
        console.log("\n----- IF -----");
        // Pega o valor de PC que aponta para próxima instrução e pede na memória
        this.mar.write(this.regs.read(0));
        console.log("mar recebe: "+this.mar.read());

        let data = this.cache.read(this.mar.read());
        if (data == null) {
            this.misses++;
            this.memoryBusy = 1;
            this.pipeline.IF_ID = {ir: null};
            return;
        }
        else {
            this.mbr.write(data);
            this.hits++;
            console.log("cache->mbr: "+this.mbr.read());
        }

        // Envia a instrução para o IR e DecodeI ao mesmo tempo
        this.regs.write(3, this.mbr.read());
        this.decI.write(this.mbr.read());

        // incrementa o PC para apontar para a próxima instrução
        this.increm.write(parseInt(this.regs.read(0), 2));
        this.increm.increment();
        this.regs.write(0, this.increm.read().toString(2).padStart(16, '0'));

        // envia para o próximo ciclo
        this.pipeline.IF_ID = {ir: this.regs.read(3)};
        console.log("IR: "+this.regs.read(3));
    }

    // ​ID (Instruction Decode): Decodifica a instrução e ativa os registradores.
    estagioID() {        
        const buffer = this.pipeline.IF_ID;
        if (!buffer || !buffer.ir) return;
        const ir = buffer.ir;

        // decodifica a instrução
        this.decI.decode();
        // envia para o mpc que vai apontar no cs
        this.mpc.write(this.decI.read())

        // paga o instrução no cs e anota nos valores
        const micro = this.cs.read(this.mpc.read());

        // cria um objeto dessa instrução que será passada
        const mir = new MicroInstructionRegister();
        mir.write(micro);

        console.log("\n----- ID - mir: "+mir.label);

        // DATA HAZZARD
        if(this.dhOn == 0 && this.dataHazzard(mir)) {
            return true;
        }

        // latchs A e B recebem o registrador certo
        this.decA.write(mir.read("a"));
        this.decB.write(mir.read("b"));

        this.latA.write(this.regs.read(this.decA.read()));
        this.latB.write(this.regs.read(this.decB.read()));

        if (mir.mar == "1") {
            this.mar.write(this.latB.read());
            if (mir.label=="addd") {this.mar.write(this.latA.read());}
            console.log("mar recebe: "+this.mar.read());

            if (mir.rd == "1") {
                let data = this.cache.read(this.mar.read());
                if (data == null) {
                    this.misses++;
                    this.memoryBusy = 2;
                    return true;
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
        console.log("amux: "+this.amux.read()+", latB: "+this.latB.read())
    }

    // ​EX (Execute): Realiza a operação aritmética/lógica na ULA (ALU).
    estagioEX() {
        const buffer = this.pipeline.ID_EX;
        if (!buffer || !buffer.mir) return;
        const mir = buffer.mir;
        
        console.log("\n----- EX - mir: "+mir.label);

        this.alu.write(this.amux.read(), this.latB.read(), mir.read("alu"));
        this.alu.calcular();

        this.shifter.write(this.alu.read("res"), mir.read("sh"));
        this.shifter.deslocar();


        // Saltos
        this.msl.write(this.alu.read("Z"), this.alu.read("N"), mir.read("cond"));
        this.msl.calcula();

        if (this.msl.read()==1) {
            this.reset = 0;
        }

        this.mmux.write(this.increm.read(), mir.read("addr"), this.msl.read());
        this.mmux.select();

        this.mpc.write(this.mmux.read());

        console.log("msl: "+this.msl.read());

        
        this.pipeline.EX_MA = {mir};
        console.log("res: "+this.shifter.read())
    }

    // ​MA (Memory Access): Acesso à memória de dados (se necessário).
    estagioMA() {
        const buffer = this.pipeline.EX_MA;
        if (!buffer || !buffer.mir) return;
        const mir = buffer.mir;

        console.log("\n----- MA - mir: "+mir.label);

        if (mir.read("mbr") == "1") {
            this.mbr.write(this.shifter.read());
            console.log("shi->mbr: "+this.mbr.read());
            if (mir.read("wr") == "1") {
                this.cache.write(this.mar.read(), this.mbr.read());
                // this.memoryBusy = 1;
                console.log("mbr->cache: "+this.mbr.read()+': '+this.mar.read());
            }
        }

        this.pipeline.MA_WB = {mir};
        console.log("wr: "+mir.read("wr"))
    }

    // ​WB (Write Back): Grava o resultado de volta no banco de registradores
    estagioWB() {
        const buffer = this.pipeline.MA_WB;
        if (!buffer || !buffer.mir) return;
        const mir = buffer.mir;

        console.log("----- WB - mir: "+mir.label);

        this.decC.write(mir.read("c"));

        if (mir.read("enc") == "1") {
            if (mir.mbr == "0") {
                this.regs.write(this.decC.read(), this.shifter.read());
            }
            else {
                this.regs.write(this.decC.read(), this.mbr.read());
            }
            console.log("reg: "+this.decC.read()+" = "+this.regs.read(this.decC.read()));
        }
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

        // pipeline
        this.memoryBusy = 0;
        this.estagios = [];
        this.pipelineWarmup = 0;
        this.pipeline = {
            IF_ID: {mir: null},
            ID_EX: {mir: null},
            EX_MA: {mir: null},
            MA_WB: {mir: null}
        };

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
