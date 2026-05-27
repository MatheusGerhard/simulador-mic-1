// main.js - O Inicializador do Sistema

// importações
import Clock from './clock.js';
import ControlUnit from './controlUnit.js';
import InstructionRegister from './ir.js';
import MemoryAddressRegister from './mar.js';
import MemoryBufferRegister from './mbr.js';
import MicroprogramCounter from './mpc.js';
import ProgramCounter from './pc.js';

import memoria from './memory.js';


// Instanciando os objetos
const relogio = new Clock();
const ir = new InstructionRegister();
const mar = new MemoryAddressRegister();
const mbr = new MemoryBufferRegister();
const mpc = new MicroprogramCounter();
const pc = new ProgramCounter(); 

const uc = new ControlUnit(mpc, memoria, pc, mar, mbr, ir);


// O Loop do Relógio (Clock)
relogio.setVelocidade(1000);
let simulacaoAtiva = true;

while (simulacaoAtiva) {
    // A cada repetição, é um pulso de clock que executa uma linha da sua tabela
    relogio.pulso(uc);
    
    // Finaliza o loop no final do programa
    if (pc.read() > 5) { 
        simulacaoAtiva = false; 
    }
}