import ArithmeticLogicUnit from './componentes/alu.js';

const alu = new ArithmeticLogicUnit();

function rodarTeste(a, b, mir, descricao) {
    console.log(`\n--- Teste: ${descricao} ---`);
    console.log(`Entradas: A=${a}, B=${b}, Op=${mir}`);
    try {
        alu.write(a, b, mir);
        alu.calcular();
        const res = alu.read("res");
        const z = alu.read("Z");
        const n = alu.read("N");
        console.log(`Resultado: ${res}`);
        console.log(`Flags:     Z=${z}, N=${n}`);
    } catch (error) {
        console.error(`ERRO DETECTADO: ${error.message}`);
    }
}

// 1. Soma básica (0 + 0)
rodarTeste("0000000000000000", "0000000000000000", "00", "Soma Zero");

// 2. Soma com carry (1 + 1 = 10 binário)
rodarTeste("0000000000000001", "0000000000000001", "00", "Soma 1+1 (Teste de Carry)");

// 3. Soma com carry longo (7 + 1 = 8 binário)
rodarTeste("0000000000000111", "0000000000000001", "00", "Soma 7+1 (Propagação de Carry)");

// 4. Operação AND (1010... AND 1111... = 1010...)
rodarTeste("1010101010101010", "1111111100000000", "01", "AND Lógico");

// 5. Identidade (Passar A) - Nota: Vai causar erro sem o fix na ALU
rodarTeste("1111000011110000", "0000000000000000", "10", "Passar A (Identidade)");

// 6. Operação NOT
rodarTeste("0000111100001111", "0000000000000000", "11", "NOT A");