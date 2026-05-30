import ArithmeticLogicUnit from "./componentes/alu.js";
import ControlStore from "./componentes/cs.js";
import Decoder from "./componentes/decoder.js";
import Jump from "./componentes/jump.js";
import MicroInstructionRegister from "./componentes/mir.js";
import MicroprogramCounter from "./componentes/mpc.js";
import O from "./componentes/o.js";
import Memory from "./componentes/ram.js";
import Registers from "./componentes/registers.js";
import Shifter from "./componentes/shifter.js";

class Hardware {
    constructor() {
        this.alu = new ArithmeticLogicUnit();
        this.cs = new ControlStore();
        this.decoder = new Decoder();
        this.jump = new Jump();
        this.mir = new MicroInstructionRegister();
        this.mpc = new MicroprogramCounter();
        this.o = new O();
        this.ram = new Memory();
        this.registers = new Registers();
        this.shifter = new Shifter();
    }

    ciclo() {
        // MPC tem um endereço e busca na CS a próxima microinstrução
        const microinstrucao = this.cs.read(parseInt(this.mpc.read(), 2));

        // MIR registra essa instrução e agora todos componentes sabem o que fazer:
        this.mir.write(microinstrucao);

        // Decoder ativa o barB correto e pega o valor no registrador
        this.decoder.write(this.mir.read('b'));
        const dadoBusB = this.registers.read(this.decoder.read());

        // ULA recebe h, barB e MIR
        const resultadoULA = this.alu.calcular(this.registers.read('h'), dadoBusB, this.mir.read('ula'));
        // Deslocador recebe o valor e envia para BarC
        const resultadoFinal = this.shifter.deslocar(resultadoULA, this.mir.read('des'));

        // Bar C recebe esse resultado e colocar no registrador(es) ativo(s)
        const c = this.mir.read('c');
        const regs = ['mar', 'mdr', 'pc', 'sp', 'lv', 'cpp', 'tos', 'opc', 'h'];
        for (let i = 0; i < 9; i++) {
            if (c[i] === '1') {
                this.registers.write(regs[i], resultadoFinal);
            }
        }


        // Próxima instrução: mpc = jump + o

        // Jump recebe ALU e MIR e envia para o MPC
        this.jump.write('flagZ', this.alu.getZ());
        this.jump.write('flagN', this.alu.getN());
        this.jump.write('mir', this.mir.read('jam'));
        this.jump.write('addr8', this.mir.read('addr')[0]);

        // Bloco O recebe: addr, mbr e jmpc
        this.o.write('addr', this.mir.read('addr'));
        this.o.write('mbr', this.registers.read('mbr').slice(24)); // apenas 8 bits
        this.o.write('jmpc', this.mir.read('jam')[2]);

        // MPC recebe Jump e O
        this.mpc.write('jump', this.jump.read());
        this.mpc.write('o', this.o.read());


        // RAM - rd ou wr
        const memSinal = this.mir.read('mem');
        const marEndereco = parseInt(this.registers.read('mar'), 2);

        // rd
        if (memSinal[0] === '1') {
            const dadoLido = this.ram.read(marEndereco);
            this.registers.write('mdr', dadoLido);
            this.registers.write('mbr', dadoLido);
        }

        // wr
        if (memSinal[1] === '1') {
            this.ram.write(marEndereco, this.registers.read('mdr'));
        }
    }
}

export default Hardware;