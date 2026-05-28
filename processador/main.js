import ControlStore from "./rom.js";
import memoria from "./memory.js";
import ControlUnit from "./controlUnit.js";

// // 1. Inicialização do sistema
const rom = new ControlStore();
const cpu = new ControlUnit(memoria, rom);

// // 2. Carregamento de um programa na RAM
// // Exemplo: LOCO 5 (Opcode 0111) -> 0111 000000000101
// // A constante '5' está nos últimos 12 bits.
// const programa = [
//     "0111000000000101" // Endereço 0: LOCO 5
// ];

// // Carrega na memória
// memoria.preencheInstrucoes(programa, [
//     { rotulo_index: 0 }
// ]);

// console.log("=== Sistema inicializado ===");
// console.log("Programa carregado na RAM[0]:", memoria.read(0));

// // 3. Loop de Execução
// // Rodaremos ciclos suficientes para: 
// // 0x00, 0x1E, 0x1F (Busca) -> 0x07 (Execução LOCO) -> 0x00 (Volta)
// const CICLOS = 10; 

// for (let i = 0; i < CICLOS; i++) {
//     const mpcAntes = cpu.mpc.read();
    
//     cpu.rodarCiclo();
    
//     console.log(`Ciclo ${i} | MPC: ${mpcAntes} -> ${cpu.mpc.read()} | AC: ${cpu.registradores.ac.read()} | MBR: ${cpu.registradores.mbr.read()}`);
// }

// console.log("=== Execução finalizada ===");
// console.log("Valor final do AC:", cpu.registradores.ac.read());

// main.js
const programa = [
    "0111000000000101", // LOCO 5
    "0001000000001010"  // STOD 10
];

memoria.preencheInstrucoes(programa, [
    { rotulo_index: 0 }, 
    { rotulo_index: 1 }
]);

console.log("=== Executando teste de escrita na RAM ===");

const CICLOS = 15; 
for (let i = 0; i < CICLOS; i++) {
    cpu.rodarCiclo();
    console.log(`Ciclo ${i} | MPC: ${cpu.mpc.read()} | AC: ${cpu.registradores.ac.read()} | Mem[10]: ${memoria.read(10)}`);
}

console.log("=== Valor Final na RAM[10]:", memoria.read(10), "===");