import ControlUnit from './controlUnit.js';

const cu = new ControlUnit();

console.log("--- Iniciando Teste da Arquitetura mac-1 ---");

// 1. Injeção de instrução na RAM conforme o README
// Instrução: LODD 100 (Carrega valor do endereço 100 no AC)
// Opcode LODD = 0000 | Endereço 100 = 000001100100
const instrucaoLODD = "0000000001100100"; // LODD 100
cu.memory.write(5, instrucaoLODD); // Injeta no endereço 5

// 2. Injeta um dado no endereço 100 para verificar se o LODD funciona
cu.memory.write(100, "1111000011110000"); 

// 3. Configura o PC inicial para o endereço da nossa instrução
cu.regs.write("pc", "0000000000000101"); // PC = 5

console.log("Estado Inicial:");
console.log("PC:", cu.regs.read("pc"));

// Executa ciclos o suficiente para completar o Fetch e o LODD
for(let i = 0; i < 10; i++) {
    const mpc = cu.mpc.read();
    console.log(`\nExecutando Ciclo ${i} (MPC: ${mpc})`);
    
    const sucesso = cu.rodarCiclo();
    
    if (!sucesso) {
        console.error("Erro: Microinstrução não encontrada!");
        break;
    }

    console.log("MIR (Label):", cu.mir.label);
    console.log("Novo PC:", cu.regs.read("pc"));
    console.log("MBR atual:", cu.regs.read("mbr"));
    console.log("AC atual:", cu.regs.read("ac"));
}

console.log("\n--- Fim do Teste ---");
