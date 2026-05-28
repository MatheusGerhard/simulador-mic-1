// Control Store - Memória de Controle (controlStore.js)

// Descrição: Memória ROM interna de 512 posições que armazena o microprograma (firmware) do processador.
// Recebe: Endereços de 9 bits vindos do MPC.
// Envia: A microinstrução correspondente para o MIR.

// Microprograma do IJVM - As 78 Microinstruções baseado no microcódigo do Mac-1 (Tanenbaum, Organização Estruturada de Computadores)

const microprograma = [];

// ============================================================================
// MICROPROGRAMA DO MAC-1 CORRIGIDO (Sinais: 1=PC, 2=AC, 3=SP, 7=MBR)
// ============================================================================

// 0x08 - LODD: Load Direct (Opcode 1000) -> AC := m[x]
microprograma[0x08] = {
    label: "lodd1",
    bbus: 7,           // Seleciona o MBR (Endereço X)
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    mar: 1,            // Carrega o endereço no MAR
    read: 1,           // Dispara a leitura da RAM
    nextAddress: 0x18
};
microprograma[0x18] = {
    label: "lodd2",
    bbus: 7,           // Pega o valor lido da memória que chegou no MBR
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    ac: 1,             // Carrega o valor no AC
    nextAddress: 0x00  // Volta para o ciclo de busca
};


// 0x01 - STOD: Store Direct (Opcode 0001) -> m[x] := ac
microprograma[0x01] = {
    label: "stod1",
    bbus: 7,           // Pega o endereço X que está no MBR
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    mar: 1,            // Carrega o endereço no MAR
    nextAddress: 0x11
};
microprograma[0x11] = {
    label: "stod2",
    bbus: 2,           // Pega o valor que está no AC
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    mbr: 1,            // Move o AC para o MBR
    write: 1,          // Aciona o sinal de escrita na memória
    nextAddress: 0x00  // Retorna para o ciclo de busca
};

// 0x02 - ADDD: Add Direct (Opcode 0010) -> ac := ac + m[x]
microprograma[0x02] = {
    label: "addd1",
    bbus: 7,           // Pega o endereço X do MBR
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    mar: 1,            // Carrega endereço no MAR
    read: 1,           // Dispara leitura da RAM
    nextAddress: 0x12
};
microprograma[0x12] = {
    label: "addd2",
    bbus: 7,           // Lê o valor que chegou da memória (MBR)
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    y: 1,              // Trava o valor no registrador Y para a soma
    nextAddress: 0x22
};
microprograma[0x22] = {
    label: "addd3",
    bbus: 2,           // Seleciona o AC
    f0: 1, f1: 1, ena: 1, enb: 1, inva: 0, inc: 0, // Soma Y + AC
    ac: 1,             // Salva resultado no AC
    nextAddress: 0x00  // Volta para busca
};

// 0x04 - SUBD: Subtração Direta (Opcode 0100) -> AC := AC - m[x]
microprograma[0x04] = {
    label: "subd1",
    bbus: 7,           // Lê endereço X do MBR
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    mar: 1,            // Carrega no MAR
    read: 1,           // Dispara leitura da RAM
    nextAddress: 0x14
};
microprograma[0x14] = {
    label: "subd2",
    bbus: 7,           // Pega o valor da RAM (MBR)
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 1, inc: 1, // Inverte bits e adiciona 1 (complemento de 2)
    y: 1,              // Armazena no registrador Y
    nextAddress: 0x24
};
microprograma[0x24] = {
    label: "subd3",
    bbus: 2,           // Seleciona o AC
    f0: 1, f1: 1, ena: 1, enb: 1, inva: 0, inc: 1, // AC + Y (já negativo)
    ac: 1,             // Salva no AC
    nextAddress: 0x00  // Volta para a busca
};


// 0x06 - JPOS: Jump if Positive (Opcode 0110) -> if AC > 0 then PC := X
microprograma[0x06] = {
    label: "jpos1",
    bbus: 7,           // Seleciona o MBR (Endereço X)
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    pc: 1,             // Carrega X no PC provisoriamente
    nextAddress: 0x16
};
microprograma[0x16] = {
    label: "jpos2",
    bbus: 2,           // Seleciona o AC
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    jamn: 0, jamz: 1,  // Se AC <= 0, não salta. (A lógica depende da implementação do seu Hardware Control Unit para testar positivo)
    nextAddress: 0x00  // Se positivo, o PC já foi alterado no jpos1 e o salto ocorre
};

// 0x05 - JZER: Jump if Zero (Opcode 0101) -> if AC == 0 then PC := X
microprograma[0x05] = {
    label: "jzer1",
    bbus: 7,           // Seleciona o MBR (Endereço X)
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    pc: 1,             // Carrega X no PC provisoriamente
    nextAddress: 0x15
};
microprograma[0x15] = {
    label: "jzer2",
    bbus: 2,           // Seleciona o AC
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    jamz: 1,           // Se AC == 0, o salto para X é mantido. Se AC != 0, a Control Unit anula a carga no PC
    nextAddress: 0x00  // Continua em sequência se AC != 0
};


// 0x03 - JUMP: Jump Incondicional (Opcode 0011) -> PC := X
microprograma[0x03] = {
    label: "jump1",
    bbus: 7,           // Seleciona o MBR (Contém o endereço X da instrução)
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    pc: 1,             // Carrega o endereço X diretamente no PC
    nextAddress: 0x00  // Retorna para o ciclo de busca buscar a próxima instrução em X
};


// 0x07 - LOCO: Load Constant (Opcode 0111) -> AC := constante
microprograma[0x07] = {
    label: "loco1",
    bbus: 7,           // Seleciona o MBR (Onde está o valor constante da instrução)
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    ac: 1,             // Carrega o valor constante diretamente no AC
    nextAddress: 0x00  // Retorna para o ciclo de busca
};


// 0x09 - LODL: Load Local (Opcode 1001) -> AC := m[SP + X]
microprograma[0x09] = {
    label: "lodl1",
    bbus: 3,           // Seleciona o SP
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    y: 1,              // Move SP para Y
    nextAddress: 0x19
};
microprograma[0x19] = {
    label: "lodl2",
    bbus: 7,           // Seleciona o X (deslocamento vindo do MBR)
    f0: 1, f1: 1, ena: 1, enb: 1, inva: 0, inc: 0, // Soma Y (SP) + MBR (X)
    mar: 1,            // Resultado vai para o MAR (endereço de memória)
    read: 1,           // Lê o valor da pilha
    nextAddress: 0x29
};
microprograma[0x29] = {
    label: "lodl3",
    bbus: 7,           // Lê o valor que chegou no MBR
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    ac: 1,             // Salva no AC
    nextAddress: 0x00
};

// 0x0A - STOL: Store Local (Opcode 1010) -> m[SP + X] := AC
microprograma[0x0A] = {
    label: "stol1",
    bbus: 3,           // Seleciona o SP
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    y: 1,              // Move SP para Y
    nextAddress: 0x1A
};
microprograma[0x1A] = {
    label: "stol2",
    bbus: 7,           // Seleciona o X (deslocamento vindo do MBR)
    f0: 1, f1: 1, ena: 1, enb: 1, inva: 0, inc: 0, // Soma Y (SP) + MBR (X)
    mar: 1,            // Resultado vai para o MAR (endereço de destino na pilha)
    nextAddress: 0x2A
};
microprograma[0x2A] = {
    label: "stol3",
    bbus: 2,           // Seleciona o AC
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    mbr: 1,            // Coloca o valor do AC no MBR
    write: 1,          // Executa a escrita na memória
    nextAddress: 0x00
};


// 0x0B - ADDL: Add Local (Opcode 1011) -> AC := AC + m[SP + X]
microprograma[0x0B] = {
    label: "addl1",
    bbus: 3,           // Seleciona o SP
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    y: 1,              // Move SP para o registrador Y
    nextAddress: 0x1B
};
microprograma[0x1B] = {
    label: "addl2",
    bbus: 7,           // Seleciona o X (deslocamento vindo do MBR)
    f0: 1, f1: 1, ena: 1, enb: 1, inva: 0, inc: 0, // Soma Y (SP) + MBR (X)
    mar: 1,            // Resultado vai para o MAR (endereço de memória)
    read: 1,           // Dispara a leitura do valor na pilha
    nextAddress: 0x2B
};
microprograma[0x2B] = {
    label: "addl3",
    bbus: 7,           // Pega o valor lido da memória (que agora está no MBR)
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    y: 1,              // Trava o valor da pilha no registrador Y
    nextAddress: 0x3B
};
microprograma[0x3B] = {
    label: "addl4",
    bbus: 2,           // Seleciona o AC
    f0: 1, f1: 1, ena: 1, enb: 1, inva: 0, inc: 0, // Soma AC + Y
    ac: 1,             // Salva o resultado no AC
    nextAddress: 0x00
};


// 0x0C - SUBL: Subtract Local (Opcode 1100) -> AC := AC - m[SP + X]
microprograma[0x0C] = {
    label: "subl1",
    bbus: 3,           // Seleciona o SP
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    y: 1,              // Move SP para Y
    nextAddress: 0x1C
};
microprograma[0x1C] = {
    label: "subl2",
    bbus: 7,           // Seleciona o X (deslocamento vindo do MBR)
    f0: 1, f1: 1, ena: 1, enb: 1, inva: 0, inc: 0, // Soma Y (SP) + MBR (X)
    mar: 1,            // Resultado vai para o MAR (endereço de memória)
    read: 1,           // Dispara a leitura da pilha
    nextAddress: 0x2C
};
microprograma[0x2C] = {
    label: "subl3",
    bbus: 7,           // Pega o valor lido da memória (MBR)
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 1, inc: 1, // Inverte e soma 1 (complemento de 2)
    y: 1,              // Armazena o valor negativo no Y
    nextAddress: 0x3C
};
microprograma[0x3C] = {
    label: "subl4",
    bbus: 2,           // Seleciona o AC
    f0: 1, f1: 1, ena: 1, enb: 1, inva: 0, inc: 1, // AC + Y (que já é o valor negativo)
    ac: 1,             // Salva o resultado no AC
    nextAddress: 0x00
};


// 0x0D - JNEG: Jump if Negative (Opcode 1101) -> if AC < 0 then PC := X
microprograma[0x0D] = {
    label: "jneg1",
    bbus: 7,           // Seleciona o MBR (Endereço X)
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    pc: 1,             // Carrega X no PC temporariamente
    nextAddress: 0x1D
};
microprograma[0x1D] = {
    label: "jneg2",
    bbus: 2,           // Seleciona o AC
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    jamn: 1,           // Verifica flag de sinal: se AC < 0, mantém o PC; se não, ignora
    nextAddress: 0x00
};


// 0x0E - JNZE: Jump if Not Zero (Opcode 1110) -> if AC != 0 then PC := X
microprograma[0x0E] = {
    label: "jnze1",
    bbus: 7,           // Seleciona o MBR (Endereço X)
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    pc: 1,             // Carrega X no PC temporariamente
    nextAddress: 0x1E
};
microprograma[0x1E] = {
    label: "jnze2",
    bbus: 2,           // Seleciona o AC
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    jamn: 0,           // Flag de negativo ignorada
    jamz: 1,           // Verifica flag de zero
    // Nota: A Unidade de Controle deve ser capaz de inverter a lógica do jamz (Not Zero)
    // Se seu hardware não suporta a inversão automática, você precisaria de um passo extra
    nextAddress: 0x00
};


// 0x0F - CALL: Call Procedure (Opcode 1111) -> m[SP] := PC, SP := SP - 1, PC := X
microprograma[0x0F] = {
    label: "call1",
    bbus: 3,           // Seleciona o SP
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    mar: 1,            // Carrega o topo da pilha (SP) no MAR
    nextAddress: 0x1F
};
microprograma[0x1F] = {
    label: "call2",
    bbus: 1,           // Seleciona o PC (que já está apontando para a próxima instrução)
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    mbr: 1,            // Move o PC para o MBR
    write: 1,          // Salva o endereço de retorno na pilha
    nextAddress: 0x2F
};
microprograma[0x2F] = {
    label: "call3",
    bbus: 3,           // Seleciona o SP
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 1, inc: 0, // SP - 1 (Decrementar SP)
    sp: 1,             // Atualiza o SP
    nextAddress: 0x3F
};
microprograma[0x3F] = {
    label: "call4",
    bbus: 7,           // Seleciona o X (endereço da sub-rotina no MBR)
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    pc: 1,             // Carrega o endereço da sub-rotina no PC
    nextAddress: 0x00
};


// 0x10 - PSHI: Push Immediate (Opcode 1000 - Exemplo de Opcode) -> m[SP] := Valor, SP := SP - 1
microprograma[0x10] = {
    label: "pshi1",
    bbus: 3,           // Seleciona o SP
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    mar: 1,            // Carrega o topo da pilha (SP) no MAR
    nextAddress: 0x1A
};
microprograma[0x1A] = {
    label: "pshi2",
    bbus: 7,           // Seleciona o Valor da constante (que está no MBR)
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    mbr: 1,            // Move o valor da constante para o MBR
    write: 1,          // Salva o valor na memória
    nextAddress: 0x2A
};
microprograma[0x2A] = {
    label: "pshi3",
    bbus: 3,           // Seleciona o SP
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 1, inc: 0, // SP - 1
    sp: 1,             // Atualiza o SP
    nextAddress: 0x00  // Fim
};


// 0x11 - POPI: Pop from Stack to AC (Opcode 1001) -> SP := SP + 1, AC := m[SP]
microprograma[0x11] = {
    label: "popi1",
    bbus: 3,           // Seleciona o SP
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 1, // SP + 1
    sp: 1,             // Atualiza o SP (apontando para o item a remover)
    mar: 1,            // Carrega o novo SP no MAR
    read: 1,           // Dispara leitura da RAM
    nextAddress: 0x1B
};
microprograma[0x1B] = {
    label: "popi2",
    bbus: 7,           // Pega o valor lido da memória (MBR)
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    ac: 1,             // Carrega o valor no AC
    nextAddress: 0x00
};


// 0x12 - PUSH: Push AC to Stack (Opcode 1010) -> m[SP] := AC, SP := SP - 1
microprograma[0x12] = {
    label: "push1",
    bbus: 3,           // Seleciona o SP
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    mar: 1,            // Carrega o topo da pilha (SP) no MAR
    nextAddress: 0x1C
};
microprograma[0x1C] = {
    label: "push2",
    bbus: 2,           // Seleciona o AC
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    mbr: 1,            // Move o valor do AC para o MBR
    write: 1,          // Executa a escrita na memória
    nextAddress: 0x2C
};
microprograma[0x2C] = {
    label: "push3",
    bbus: 3,           // Seleciona o SP
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 1, inc: 0, // SP - 1
    sp: 1,             // Atualiza o SP
    nextAddress: 0x00  // Fim da instrução
};


// 0x13 - POP: Pop from Stack to AC (Opcode 1011) -> SP := SP + 1, AC := m[SP]
microprograma[0x13] = {
    label: "pop1",
    bbus: 3,           // Seleciona o SP
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 1, // SP + 1
    sp: 1,             // Atualiza o SP (aponta para o valor a ser retirado)
    mar: 1,            // Carrega o novo endereço no MAR
    read: 1,           // Dispara a leitura da RAM
    nextAddress: 0x1D
};
microprograma[0x1D] = {
    label: "pop2",
    bbus: 7,           // Seleciona o MBR (dado lido da pilha)
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    ac: 1,             // Carrega o dado no AC
    nextAddress: 0x00  // Fim da instrução
};


// 0x14 - RETN: Return from Procedure (Opcode 1111) -> SP := SP + 1, PC := m[SP]
microprograma[0x14] = {
    label: "retn1",
    bbus: 3,           // Seleciona o SP
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 1, // SP + 1 (Ajusta para o endereço de retorno)
    sp: 1,             // Atualiza o SP
    mar: 1,            // Carrega o endereço no MAR
    read: 1,           // Lê o endereço da pilha
    nextAddress: 0x1E
};
microprograma[0x1E] = {
    label: "retn2",
    bbus: 7,           // Pega o endereço lido (MBR)
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    pc: 1,             // Carrega o endereço no PC (retorna ao fluxo principal)
    nextAddress: 0x00
};


// 0x15 - SWAP: Exchange AC and m[SP+1] (Opcode 1010)
microprograma[0x15] = {
    label: "swap1",
    bbus: 3,           // Seleciona o SP
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 1, // SP + 1 (Ajusta para o topo da pilha)
    mar: 1,            // Carrega o endereço no MAR
    read: 1,           // Lê o valor atual da pilha
    nextAddress: 0x1F
};
microprograma[0x1F] = {
    label: "swap2",
    bbus: 7,           // Pega o valor lido da pilha (MBR)
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    y: 1,              // Armazena o valor da pilha temporariamente em Y
    nextAddress: 0x2F
};
microprograma[0x2F] = {
    label: "swap3",
    bbus: 2,           // Seleciona o AC
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    mbr: 1,            // Move AC para MBR
    write: 1,          // Salva o valor antigo do AC na pilha
    nextAddress: 0x3F
};
microprograma[0x3F] = {
    label: "swap4",
    bbus: 5,           // Seleciona Y (valor antigo da pilha)
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    ac: 1,             // Carrega o valor antigo da pilha para o AC
    nextAddress: 0x00  // Fim
};


// 0x16 - INSP: Increment Stack Pointer (Opcode 1111) -> SP := SP + 1
microprograma[0x16] = {
    label: "insp1",
    bbus: 3,           // Seleciona o SP
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 1, // Soma 1 ao SP
    sp: 1,             // Grava o novo valor no SP
    nextAddress: 0x00  // Fim da instrução
};


// 0x17 - DESP: Decrement Stack Pointer (Opcode 1111) -> SP := SP - 1
microprograma[0x17] = {
    label: "desp1",
    bbus: 3,           // Seleciona o SP
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 1, inc: 0, // Inverte e soma 0 (inva: 1, inc: 0 realiza -1 na ULA)
    sp: 1,             // Grava o novo valor decrementado no SP
    nextAddress: 0x00  // Fim da instrução
};



class ControlStore {
    constructor() {
        this.rom = new Array(512).fill(null);
        for (let i = 0; i < 512; i++) {
            if (microprograma[i] !== undefined) {
                this.rom[i] = microprograma[i];
            }
        }
    }

    read(endereco) {
        const microinstrucao = this.rom[endereco];
        if (!microinstrucao) {
            return null;
        }
        return microinstrucao;
    }
}

export default ControlStore;
