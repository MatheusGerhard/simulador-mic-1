// Control Store - Memória de Controle (CS)

// Descrição: Memória ROM interna de 512 posições que armazena o microprograma (firmware) do processador.
// Recebe: Endereços de 9 bits vindos do MPC.
// Envia: A microinstrução correspondente para o MIR.

// MICROPROGRAMA DO MAC-2

const microprograma = [];

// 0000: PC - o endereço da próxima macroinstrução
// 0001: AC - temporariamente os resultados das operações da ULA
// 0010: SP - ponteiro para o topo da pilha
// 0011: IR - a macroinstrução atual
// 0100: TIR - instrução temporaria
// 0101: 0 - valor nulo
// 0110: +1 - 1
// 0111: -1 - -1
// 1000: AM - máscara 12 bits
// 1001: SM - máscara 8 bits
// 1010: A - genérico


// LODD 0000
// 5: mar:=ir; rd; ac:=mbr;
microprograma[0] = {label: "lodd", amux: "1", cond: "00", alu: "10", sh: "00", mbr: "1", mar: "1", rd: "1", wr: "0", enc: "1", c: "0001", b: "0011", a: "1111", addr: "00000000"};


// STOD 0001
// 1: mar:=ir; mbr:=ac; wr;
microprograma[1] = {label: "stod", amux: "0", cond: "00", alu: "10", sh: "00", mbr: "1", mar: "1", rd: "0", wr: "1", enc: "0", c: "1111", b: "0011", a: "0001", addr: "00000000"};


// ADDD 0010
// 2: mar:=ir; rd; ac:=mbr + ac; 
microprograma[2] = {label: "addd", amux: "1", cond: "00", alu: "00", sh: "00", mbr: "1", mar: "1", rd: "1", wr: "0", enc: "1", c: "0001", b: "0001", a: "0011", addr: "00000000"};


// SUBD 0011
// 3: mar:=ir; rd;  a:=inv(mbr); 
microprograma[3] = {label: "subd", amux: "1", cond: "00", alu: "11", sh: "00", mbr: "0", mar: "1", rd: "1", wr: "0", enc: "1", c: "1010", b: "0011", a: "0000", addr: "00000000"};

// ac:=ac + 1;
microprograma[31] = {label: "subd2", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "1", wr: "0", enc: "1", c: "0001", b: "0001", a: "0110", addr: "00000000"};

// ac:=ac + a;
microprograma[32] = {label: "subd3", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0001", b: "0001", a: "1010", addr: "00000000"};


// JPOS 0100
microprograma[4] = {label: "jpos", amux: "0", cond: "01", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0001", addr: "00000000"};


// JUMP 0110
microprograma[6] = {label: "jump", amux: "0", cond: "11", alu: "01", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0000", b: "0011", a: "1000", addr: "00000000"};


// LOCO 0111
// 7: ac:=band(ir, amask);
microprograma[7] = {label: "loco", amux: "0", cond: "00", alu: "01", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0001", b: "0011", a: "1000", addr: "00000000"};


// LODL 1000
microprograma[8] = {label: "lodl1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "1011", b: "0011", a: "0010", addr: "00000000"};


// STOL 1001
microprograma[9] = {label: "stol1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "1011", b: "0011", a: "0010", addr: "00000000"};


// ADDL 1010
microprograma[10] = {label: "addl1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "1011", b: "0011", a: "0010", addr: "00000000"};


// SUBL 1011
microprograma[11] = {label: "subl1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "1011", b: "0011", a: "0010", addr: "00000000"};


// JNEG 1100
microprograma[12] = {label: "jneg n22", amux: "0", cond: "01", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0001", addr: "00010110"};


// JNZE 1101
microprograma[13] = {label: "jnze z0", amux: "0", cond: "10", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0001", addr: "00000000"};


// CALL 1110
microprograma[14] = {label: "call1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0010", b: "0010", a: "0111", addr: "00000000"};


// PSHI 1111-0000
microprograma[15] = {label: "pshi1", amux: "0", cond: "00", alu: "10", sh: "00", mbr: "0", mar: "1", rd: "1", wr: "0", enc: "0", c: "0000", b: "0000", a: "0001", addr: "00000000"};


// POPI 1111-0010
microprograma[17] = {label: "popi1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "1", rd: "1", wr: "0", enc: "1", c: "0010", b: "0010", a: "0110", addr: "00000000"};


// PUSH 1111-0100
microprograma[19] = {label: "push1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0010", b: "0010", a: "0111", addr: "00000000"};


// POP 1111-0110
// 56: mar:=sp; sp:=sp + 1; rd;
microprograma[21] = {label: "pop1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "1", rd: "1", wr: "0", enc: "1", c: "0010", b: "0010", a: "0110", addr: "00000000"};


// RETN 1111-1000
microprograma[23] = {label: "retn1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "1", rd: "1", wr: "0", enc: "1", c: "0010", b: "0010", a: "0110", addr: "00000000"};


// SWAP 1111-1010
microprograma[25] = {label: "swap1", amux: "0", cond: "00", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "1010", b: "0000", a: "0001", addr: "00000000"};


// INSP 1111-1100
microprograma[27] = {label: "insp1", amux: "0", cond: "00", alu: "01", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "1010", b: "0011", a: "1001", addr: "00000000"};


// DESP 1111-1110
microprograma[29] = {label: "desp1", amux: "0", cond: "00", alu: "01", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "1010", b: "0011", a: "1001", addr: "00000000"};



class ControlStore {
    constructor() {
        this.rom = new Array(512).fill(null);
        for (let i = 0; i < 512; i++) {
            if (microprograma[i] != undefined) {
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
