import ControlUnit from './controlUnit.js';
import Clock from './componentes/clock.js';

const clock = new Clock();
const uc = new ControlUnit();

console.log("--- Iniciando Teste da Arquitetura mac-1 ---");

// 1. Injeção de instrução na RAM conforme o README
// Instrução: LODD 100 (Carrega valor do endereço 100 no AC)
// Opcode LODD = 0000 | Endereço 100 = 000001100100
const instrucaoLODD = "1111000011110000"; // LODD 100
uc.memory.write(5, instrucaoLODD); // Injeta no endereço 5
console.log(uc.memory.read(5));

// 2. Injeta um dado no endereço 100 para verificar se o LODD funciona
uc.memory.write(100, "1111000011110000"); 

// 3. Configura o PC inicial para o endereço da nossa instrução
uc.regs.write(0, "0000000000000101"); // PC = 5

console.log("Estado Inicial:");
console.log("PC:", uc.regs.read(0));

// Exeucta ciclos o suficiente para completar o Fetch e o LODD

clock.iniciar(uc);

console.log("\n--- Fim do Teste ---");
