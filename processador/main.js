// main.js - O Inicializador do Sistema

// importações
import Clock from './clock.js';
import ControlUnit from './controlUnit.js';
import InstructionRegister from './ir.js';
import Memoria from './memory.js';
import MemoryAddressRegister from './mar.js';
import MemoryBufferRegister from './mbr.js';
import MicroprogramCounter from './mpc.js';
import PC from './pc.js';


// Instanciando os objetos
const relogio = new Clock();
const ir = new InstructionRegister();
const memoria = new Memoria();
const mar = new MemoryAddressRegister();
const mbr = new MemoryBufferRegister();
const mpc = new MPC();
const uc = new ControlUnit(mpc, memoria, pc, mar, mbr, ir);
const pc = new PC(); 

const uc = new ControlUnit(mpc, memoria, pc, mar, mbr, ir);

// O Loop do Relógio (Clock)
let simulacaoAtiva = true;

while (simulacaoAtiva) {
    // A cada repetição, é um pulso de clock que executa uma linha da sua tabela
    relogio.pulso(uc);
    
    // Finaliza o loop no final do programa
    if (pc.read() > 5) { 
        simulacaoAtiva = false; 
    }
}