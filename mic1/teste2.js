import Hardware from "./controlUnit.js";

const hw = new Hardware();

// --- CONFIGURAÇÃO DO TESTE 2 ---
// Programa: BIPUSH 20; BIPUSH 8; ISUB; DUP; IADD;
// Objetivo: Validar subtração, duplicação e soma encadeada.

// Inicializa Registradores Críticos
hw.registers.write('sp', "00000000000000000000001111101000"); // SP = 1000
hw.registers.write('pc', "00000000000000000000000000000000"); // PC = 0

const toBin = (val) => (val >>> 0).toString(2).padStart(32, '0');

// RAM: BIPUSH 20 (Endereços 0-2)
hw.ram.write(0, toBin(16));  // BIPUSH
hw.ram.write(1, toBin(0));   
hw.ram.write(2, toBin(20));  // Valor 20

// RAM: BIPUSH 8 (Endereços 3-5)
hw.ram.write(3, toBin(16));  // BIPUSH
hw.ram.write(4, toBin(0));   
hw.ram.write(5, toBin(8));   // Valor 8

// RAM: ISUB (Endereço 6)
hw.ram.write(6, toBin(100)); // ISUB (0x64)

// RAM: DUP (Endereço 7)
hw.ram.write(7, toBin(89));  // DUP (0x59)

// RAM: IADD (Endereço 8)
hw.ram.write(8, toBin(96));  // IADD (0x60)

console.log("--- INICIANDO SIMULAÇÃO MIC-1 (TESTE DE FLUXO COMPLEXO) ---");
console.log("Operação: (20 - 8) + (20 - 8) = 24\n");

function logEstado(cicloNome) {
    const pc = parseInt(hw.registers.read('pc'), 2);
    const sp = parseInt(hw.registers.read('sp'), 2);
    const tos = parseInt(hw.registers.read('tos'), 2);
    const mbr = parseInt(hw.registers.read('mbr'), 2);
    console.log(`[${cicloNome.padEnd(15)}] PC:${pc} | SP:${sp} | TOS:${tos} | MBR:${mbr}`);
}

// Executa ciclos suficientes para as 5 macroinstruções (~40 ciclos)
for (let i = 1; i <= 45; i++) {
    hw.ciclo();
    const label = hw.mir.read('label') || "---";
    logEstado(`Ciclo ${i}: ${label}`);
}

// --- VERIFICAÇÃO FINAL ---
const tosVal = parseInt(hw.registers.read('tos'), 2);
if (tosVal === 24) {
    console.log("\n✅ SUCESSO: O resultado final no topo da pilha (TOS) é 24.");
} else {
    console.error(`\n❌ ERRO: Valor esperado 24, mas encontrou: ${tosVal}`);
}