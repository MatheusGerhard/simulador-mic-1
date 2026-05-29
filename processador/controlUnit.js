// Control Unit - Unidade de Controle (ControlUnit)

// Descrição: O "cérebro" do processador. Decodifica instruções e coordena o fluxo de dados.
// Recebe: O opcode vindo do IR e sinais de flags da ALU.
// Envia: Sinais de controle (Enable, Read, Write, Select ALU Op) para todos os outros componentes.

// Importações
import MicroprogramCounter from "./mpc.js";
import MicroInstructionRegister from "./mir.js";
import ControlStore from "./rom.js";

import ArithmeticLogicUnit from "./alu.js";
import Shifter from "./shifter.js";
import BusB from "./busB.js";
import BusC from "./busC.js";

import Accumulator from "./ac.js";
import ProgramCounter from "./pc.js";
import InstructionRegister from "./ir.js";
import MemoryAddressRegister from "./mar.js";
import MemoryBufferRegister from "./mbr.js";
import RegisterY from "./y.js";
import StackPointer from "./sp.js";

import Clock from "./clock.js";


class ControlUnit {
    constructor(memoria, rom) {
        // --- Memórias Externas/Conectadas ---
        this.memoria = memoria; // RAM do sistema
        this.rom = rom;         // Control Store contendo o microprograma gravado

        // --- Registradores de Controle Internos ---
        this.mpc = new MicroprogramCounter();
        this.mir = new MicroInstructionRegister();

        // --- Banco Interno de Registradores (Register File) ---
        this.registradores = {
            ac:  new Accumulator(),
            pc:  new ProgramCounter(),
            ir:  new InstructionRegister(),
            tir: new InstructionRegister(),
            mar: new MemoryAddressRegister(),
            mbr: new MemoryBufferRegister(),
            y:   new RegisterY(),
            sp:  new StackPointer()
        };

        // --- Circuitos Combinacionais Internos ---
        this.alu = new ArithmeticLogicUnit();
        this.shifter = new Shifter();
        this.bbus = new BusB();
        this.cbus = new BusC();
    }

    rodarCiclo() {
        const enderecoAtual = parseInt(this.mpc.read(), 2);
        const micro = this.rom.read(enderecoAtual);
        if (!micro) return false;
        
        this.mir.carregar(micro);

        // 1. Lógica de MEMÓRIA (Antes do Data Path para carregar o MBR)
        // Se o sinal de leitura está ativo
        if (this.mir.read) {
            const endereco = parseInt(this.registradores.mar.read(), 2);
            const dado = this.memoria.read(endereco);
            this.registradores.mbr.write(dado);
        }

        // 2. Execução do Data Path
        let valorBusB = this.bbus.read(this.registradores, this.mir.bbus);
        let resultado = this.alu.calcular(this.registradores.y.read(), valorBusB, this.mir);
        resultado = this.shifter.deslocar(resultado, this.mir);
        this.cbus.distribuir(resultado, this.registradores, this.mir);

        // 3. Lógica de MEMÓRIA (Após o Data Path para escrita)
        if (this.mir.write) {
            const endereco = parseInt(this.registradores.mar.read(), 2);
            const dado = this.registradores.mbr.read();
            this.memoria.write(endereco, dado);
        }

        const proximo = this.calcularProximoEndereco(this.alu.getZeroFlag(), this.alu.getNegativeFlag());
        this.mpc.write(proximo);
        return true;
    }

    calcularProximoEndereco(z, n) {
        let proximo = this.mir.nextAddress;

        // Lógica JAM (Jumps Condicionais)
        // Se JAMZ e Z=1, ou JAMN e N=1, realizamos um OR no bit mais significativo do endereço
        if ((this.mir.jamz && z) || (this.mir.jamn && n)) {
            proximo |= 0x100; // Salta para a região alta da ROM (256-511)
        }

        // Se JMPC estiver ativo, pula para o endereço do Opcode (0-15)
        if (this.mir.jmpc) {
            const mbrValue = this.registradores.mbr.read();
            const opcode = parseInt(mbrValue.slice(0, 4), 2);
            proximo = opcode;
        }

        // Retorna formatado para o seu MPC
        return proximo.toString(2).padStart(16, "0");
    }
}

export default ControlUnit;