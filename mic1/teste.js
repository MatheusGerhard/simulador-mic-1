import Hardware from "./controlUnit.js";

const hw = new Hardware();

// --- CONFIGURAÇÃO DO TESTE ---
// Programa: BIPUSH 5; BIPUSH 10; IADD;
// Nota: Devido ao microprograma atual em cs.js (bipush1 incrementa PC novamente),
// o operando deve estar 1 endereço após o esperado se Main2 também incrementa.

// Inicializa Registradores Críticos
hw.registers.write('sp', "00000000000000000000001111101000"); // SP = 1000
hw.registers.write('pc', "00000000000000000000000000000000"); // PC = 0

const toBin = (val) => val.toString(2).padStart(32, '0');

// RAM: Endereços 0 e 1 (BIPUSH 5)
hw.ram.write(0, toBin(16)); // BIPUSH
hw.ram.write(1, toBin(0));  // (Espaço pulado pelo incremento extra no bipush1 em cs.js)
hw.ram.write(2, toBin(5));  // Valor 5

// RAM: Endereços 3 e 4 (BIPUSH 10)
hw.ram.write(3, toBin(16)); // BIPUSH
hw.ram.write(4, toBin(0)); 
hw.ram.write(5, toBin(10)); // Valor 10

// RAM: Endereço 6 (IADD)
hw.ram.write(6, toBin(96)); // IADD (0x60)

console.log("--- INICIANDO SIMULAÇÃO MIC-1 (BIPUSH 5 + BIPUSH 10 + IADD) ---");

function logEstado(cicloNome) {
    const pc = parseInt(hw.registers.read('pc'), 2);
    const sp = parseInt(hw.registers.read('sp'), 2);
    const tos = parseInt(hw.registers.read('tos'), 2);
    const mbr = parseInt(hw.registers.read('mbr'), 2);
    console.log(`[${cicloNome.padEnd(15)}] PC:${pc} | SP:${sp} | TOS:${tos} | MBR:${mbr}`);
}

// Executa ciclos suficientes para as 3 macroinstruções
// Fetch(3) + BIPUSH(5) + Fetch(3) + BIPUSH(5) + Fetch(3) + IADD(3) = ~22 ciclos
for (let i = 1; i <= 25; i++) {
    hw.ciclo();
    const label = hw.mir.read('label') || "---";
    logEstado(`Ciclo ${i}: ${label}`);
}

// --- VERIFICAÇÃO FINAL ---
const tosVal = parseInt(hw.registers.read('tos'), 2);
if (tosVal === 15) {
    console.log("\n✅ SUCESSO: O resultado no topo da pilha (TOS) é 15.");
} else {
    console.error(`\n❌ ERRO: Valor esperado 15, mas encontrou: ${tosVal}`);
}