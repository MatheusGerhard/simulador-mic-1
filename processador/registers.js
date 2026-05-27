// processador/componentes/registers.js

const registers = {
    pc: 0,       // Program Counter (Endereço da macroinstrução atual)
    ac: 0,       // Acumulador
    sp: 4095,    // Stack Pointer (Geralmente começa no topo da memória)
    ir: "0000000000000000",  // Instruction Register (Guarda a string da instrução atual)
    tir: "0000000000000000", // Temporary IR usado para os shifts de decodificação
    mbr: "0000000000000000", // Memory Buffer Register (Guarda o que veio da memória)
    mar: 0,       // Memory Address Register
    a: 0,         // Registrador auxiliar A
    
    // Flags de status para os pulos condicionais
    n: false,     // Flag de Negativo
    z: false      // Flag de Zero
};

export default registers;