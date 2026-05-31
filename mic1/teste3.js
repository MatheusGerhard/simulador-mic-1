import Hardware from "./controlUnit.js";

const hw = new Hardware();

// --- CONFIGURAÇÃO DO TESTE 3 ---
// Programa: BIPUSH 15; BIPUSH 7; IAND; BIPUSH 8; IOR; BIPUSH 99; POP;
// Objetivo: Validar operações lógicas (AND/OR) e a instrução POP.

// Inicializa Registradores Críticos
hw.registers.write('sp', "00000000000000000000001111101000"); // SP = 1000
hw.registers.write('pc', "00000000000000000000000000000000"); // PC = 0

const toBin = (val) => (val >>> 0).toString(2).padStart(32, '0');

// RAM: BIPUSH 15
hw.ram.write(0, toBin(16));  // BIPUSH
hw.ram.write(1, toBin(0));   
hw.ram.write(2, toBin(15));  

// RAM: BIPUSH 7
hw.ram.write(3, toBin(16));  
hw.ram.write(4, toBin(0));   
hw.ram.write(5, toBin(7));   

// RAM: IAND
hw.ram.write(6, toBin(126)); // IAND (0x7E)

// RAM: BIPUSH 8
hw.ram.write(7, toBin(16));  
hw.ram.write(8, toBin(0));   
hw.ram.write(9, toBin(8));   

// RAM: IOR
hw.ram.write(10, toBin(176)); // IOR (0xB0)

// RAM: BIPUSH 99
hw.ram.write(11, toBin(16)); 
hw.ram.write(12, toBin(0));  
hw.ram.write(13, toBin(99)); 

// RAM: POP
hw.ram.write(14, toBin(87)); // POP (0x57)

console.log("--- INICIANDO SIMULAÇÃO MIC-1 (TESTE LÓGICO E POP) ---");
console.log("Operação esperada: ((15 & 7) | 8) = 15. Depois POP no 99.\n");

function logEstado(cicloNome) {
    const pc = parseInt(hw.registers.read('pc'), 2);
    const sp = parseInt(hw.registers.read('sp'), 2);
    const tos = parseInt(hw.registers.read('tos'), 2);
    console.log(`[${cicloNome.padEnd(15)}] PC:${pc} | SP:${sp} | TOS:${tos}`);
}

for (let i = 1; i <= 60; i++) {
    hw.ciclo();
    const label = hw.mir.read('label') || "---";
    logEstado(`Ciclo ${i}: ${label}`);
}

const tosVal = parseInt(hw.registers.read('tos'), 2);
if (tosVal === 15) {
    console.log("\n✅ SUCESSO: O resultado final no TOS após o POP é 15.");
} else {
    console.error(`\n❌ ERRO: Valor esperado 15, mas encontrou: ${tosVal}`);
}