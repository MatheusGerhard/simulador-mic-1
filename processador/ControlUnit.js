// Control Unit / Unidade de Controle (ControlUnit)

// Descrição: O "cérebro" do processador. Decodifica instruções e coordena o fluxo de dados.
// Recebe: O opcode vindo do IR e sinais de flags da ALU.
// Envia: Sinais de controle (Enable, Read, Write, Select ALU Op) para todos os outros componentes.

import memoria from 'memory.js';
import registers from 'registers.js';

class ControlUnit {
    constructor() {
        this.mpc = 0; // Ponteiro que diz qual passo (linha) executar agora
    }

    // Executa um passo por vez (um pulso de clock)
    rodaCiclo() {
        switch (this.mpc) {
            case 0:
                registers.mar = registers.pc;
                registers.mbr = memoria.read(registers.mar);
                this.mpc = 1; // Próximo passo é o 1
                break;

            case 1:
                registers.pc = registers.pc + 1;
                registers.mbr = memoria.read(registers.mar);
                this.mpc = 2; // Próximo passo é o 2
                break;

            case 2:
                registers.ir = registers.mbr;
                console.log("Instrução na mesa (IR):", registers.ir);
                
                // Aqui vai entrar a decodificação no próximo passo...
                this.mpc = 0; // Por enquanto, volta ao início
                break;
        }
    }
}

export default ControlUnit;
