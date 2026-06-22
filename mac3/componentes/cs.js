// Control Store - Memória de Controle (CS)

// Descrição: Memória ROM interna de 512 posições que armazena o microprograma (firmware) do processador.
// Recebe: Endereços de 9 bits vindos do MPC.
// Envia: A microinstrução correspondente para o MIR.

// MICROPROGRAMA DO MAC-2

const microprograma = [];

// CICLO DE BUSCA (FETCH)
// 0: mar:=pc; pc:=pc + 1; rd;
microprograma[0] = {label: "fetch1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "1", rd: "1", wr: "0", enc: "1", c: "0000", b: "0000", a: "0110", addr: "00000000"};

// 1: ir:=mbr; if n then goto 24;
microprograma[1] = {label: "fetch2", amux: "1", cond: "01", alu: "10", sh: "00", mbr: "1", mar: "0", rd: "1", wr: "0", enc: "1", c: "0011", b: "0000", a: "0000", addr: "00011000"};

// 2: tir:=lshift(ir + ir); if n then goto 15;
microprograma[2] = {label: "fetch3", amux: "0", cond: "01", alu: "00", sh: "01", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0100", b: "0011", a: "0011", addr: "00001111"};

// 3: tir:=lshift(tir); if n then goto 8;
microprograma[3] = {label: "fetch4", amux: "0", cond: "01", alu: "10", sh: "01", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0100", b: "0000", a: "0100", addr: "00001000"};

// 4: alu:=tir; if n then goto 7;
microprograma[4] = {label: "fetch5", amux: "0", cond: "01", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0100", b: "0000", a: "0100", addr: "00000111"};


// LODD 0000
// 5: mar:=ir; rd;
microprograma[5] = {label: "lodd1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "1", rd: "1", wr: "0", enc: "0", c: "0000", b: "0011", a: "0000", addr: "00000000"};

// 6: ac:=mbr; goto 0;
microprograma[6] = {label: "lodd2", amux: "1", cond: "11", alu: "10", sh: "00", mbr: "1", mar: "0", rd: "0", wr: "0", enc: "1", c: "0001", b: "0000", a: "0000", addr: "00000000"};


// STOD 0001
// 7: mar:=ir; mbr:=ac; wr; goto 0;
microprograma[7] = {label: "stod1", amux: "0", cond: "11", alu: "10", sh: "00", mbr: "1", mar: "1", rd: "0", wr: "1", enc: "0", c: "0000", b: "0011", a: "0001", addr: "00000000"};

// 8: alu:=tir; if n then goto 11;
microprograma[8] = {label: "stod_j1", amux: "0", cond: "01", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0100", addr: "00001011"};


// ADDD 0010
// 9: mar:=ir; rd;
microprograma[9] = {label: "addd1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "1", rd: "1", wr: "0", enc: "0", c: "0000", b: "0011", a: "0000", addr: "00000000"};

// 10: ac:=mbr + ac; goto 0;
microprograma[10] = {label: "addd2", amux: "1", cond: "11", alu: "00", sh: "00", mbr: "1", mar: "0", rd: "0", wr: "0", enc: "1", c: "0001", b: "0001", a: "0000", addr: "00000000"};


// SUBD 0011
// 11: mar:=ir; rd;
microprograma[11] = {label: "subd1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "1", rd: "1", wr: "0", enc: "0", c: "0000", b: "0011", a: "0000", addr: "00000000" };

// 12: ac:=ac + 1;
microprograma[12] = {label: "subd2", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "1", wr: "0", enc: "1", c: "0001", b: "0001", a: "0110", addr: "00000000"};

// 13: a:=inv(mbr);
microprograma[13] = {label: "subd3", amux: "1", cond: "00", alu: "11", sh: "00", mbr: "1", mar: "0", rd: "0", wr: "0", enc: "1", c: "1010", b: "0000", a: "0000", addr: "00000000"};

// 14: ac:=ac + a; goto 0;
microprograma[14] = {label: "subd4 g0", amux: "0", cond: "11", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0001", b: "0001", a: "1010", addr: "00000000"};

// 15: tir:=lshift(tir); if n then goto 21;
microprograma[15] = {label: "subd_j1", amux: "0", cond: "01", alu: "10", sh: "01", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0100", b: "0000", a: "0100", addr: "00010101"};

// 16: alu:=tir; if n then goto 19;
microprograma[16] = {label: "subd_j2", amux: "0", cond: "01", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0100", addr: "00010011"};


// JPOS 0100
// 17: alu:=ac; if n then goto 0;
microprograma[17] = {label: "jpos", amux: "0", cond: "01", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0001", addr: "00000000"};

// 18: pc:=band(ir, amask); goto 0;
microprograma[18] = {label: "jpos_target", amux: "0", cond: "11", alu: "01", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0000", b: "0011", a: "1000", addr: "00000000"};


// JZER 0101
// 19: alu:=ac; if z then goto 18;
microprograma[19] = {label: "jzer", amux: "0", cond: "10", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0001", addr: "00010010"};

// 20: goto 0;
microprograma[20] = {label: "jzer_else", amux: "0", cond: "11", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0000", addr: "00000000"};

// 21: alu:=tir; if n then goto 23;
microprograma[21] = {label: "jzer_j1", amux: "0", cond: "01", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0100", addr: "00010111"};


// JUMP 0110
// 22: pc:=band(ir, amask); goto 0;
microprograma[22] = {label: "jump", amux: "0", cond: "11", alu: "01", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0000", b: "0011", a: "1000", addr: "00000000"};


// LOCO 0111
// 23: ac:=band(ir, amask); goto 0;
microprograma[23] = {label: "loco", amux: "0", cond: "11", alu: "01", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0001", b: "0011", a: "1000", addr: "00000000"};

// 24: tir:=lshift(ir + ir); if n then goto 36;
microprograma[24] = {label: "loco_j1", amux: "0", cond: "01", alu: "00", sh: "01", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0100", b: "0011", a: "0011", addr: "00100100"};

// 25: tir:=lshift(tir); if n then goto 31;
microprograma[25] = {label: "loco_j2", amux: "0", cond: "01", alu: "10", sh: "01", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0100", b: "0000", a: "0100", addr: "00011111"};

// 26: alu:=tir; if n then goto 29;
microprograma[26] = {label: "loco_j3", amux: "0", cond: "01", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0100", addr: "00011101"};


// LODL 1000
// 27: a:=ir + sp;
microprograma[27] = {label: "lodl1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "1011", b: "0011", a: "0010", addr: "00000000"};

// 28: mar:=a; rd; goto 6;
microprograma[28] = {label: "lodl2", amux: "0", cond: "11", alu: "00", sh: "00", mbr: "0", mar: "1", rd: "1", wr: "0", enc: "0", c: "0000", b: "1011", a: "0000", addr: "00000110"};


// STOL 1001
// 29: a:=ir + sp;
microprograma[29] = {label: "stol1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "1011", b: "0011", a: "0010", addr: "00000000"};

// 30: mar:=a; mbr:=ac; wr; goto 0;
microprograma[30] = {label: "stol2", amux: "0", cond: "11", alu: "10", sh: "00", mbr: "1", mar: "1", rd: "0", wr: "1", enc: "0", c: "0000", b: "1011", a: "0001", addr: "00001010"};

// 31: alu:=tir; if n then goto 34;
microprograma[31] = {label: "stol_j", amux: "0", cond: "01", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0100", addr: "00100010"};


// ADDL 1010
// 32: a:=ir + sp;
microprograma[32] = {label: "addl1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "1011", b: "0011", a: "0010", addr: "00000000"};

// 33: mar:=a; rd; goto 10;
microprograma[33] = {label: "addl2 g13", amux: "0", cond: "11", alu: "10", sh: "00", mbr: "0", mar: "1", rd: "1", wr: "0", enc: "0", c: "0000", b: "1011", a: "0000", addr: "00001010"};


// SUBL 1011
// 34: a:=ir + sp;
microprograma[34] = {label: "subl1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "1011", b: "0011", a: "0010", addr: "00000000"};

// 35: mar:=a; rd; goto 12;
microprograma[35] = {label: "subl2", amux: "0", cond: "11", alu: "10", sh: "00", mbr: "0", mar: "1", rd: "1", wr: "0", enc: "0", c: "0000", b: "1011", a: "0000", addr: "00001100"};

// 36: tir:=lshift(tir); if n then goto 41;
microprograma[36] = {label: "subl_j1", amux: "0", cond: "01", alu: "10", sh: "01", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0100", b: "0000", a: "0100", addr: "00101001"};

// 37: alu:=tir; if n then goto 39;
microprograma[37] = {label: "subl_j2 n44", amux: "0", cond: "01", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0100", addr: "00100111"};


// JNEG 1100
// 38: alu:=ac; if n then goto 22;
microprograma[38] = {label: "jneg n22", amux: "0", cond: "01", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0001", addr: "00010110"};


// JNZE 1101
// 39: alu:=ac; if z then goto 0;
microprograma[39] = {label: "jnze z0", amux: "0", cond: "10", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0001", addr: "00000000"};

// 40: pc:=band(ir, amask); goto 0;
microprograma[40] = {label: "jnze_target g0", amux: "0", cond: "11", alu: "01", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0000", b: "0011", a: "1000", addr: "00000000"};

// 41: tir:=lshift(tir); if n then goto 45;
microprograma[41] = {label: "jnze_j", amux: "0", cond: "01", alu: "10", sh: "01", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0100", b: "0000", a: "0100", addr: "00101101"};


// CALL 1110
// 42: sp:=sp + (-1);
microprograma[42] = {label: "call1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0010", b: "0010", a: "0111", addr: "00000000"};

// 43: mar:=sp; mbr:=pc; wr;
microprograma[43] = {label: "call2", amux: "0", cond: "00", alu: "10", sh: "00", mbr: "1", mar: "1", rd: "0", wr: "1", enc: "0", c: "0000", b: "0010", a: "0000", addr: "00000000"};

// 44: pc:=band(ir, amask); wr; goto 0;
microprograma[44] = {label: "call3 g0", amux: "0", cond: "11", alu: "01", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0000", b: "0011", a: "1000", addr: "00000000"};

// 45: tir:=lshift(tir); if n then goto 58;
microprograma[45] = {label: "call_j1", amux: "0", cond: "01", alu: "10", sh: "01", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0100", b: "0000", a: "0100", addr: "00111010"};

// 46: tir:=lshift(tir); if n then goto 53;
microprograma[46] = {label: "call_j2", amux: "0", cond: "01", alu: "10", sh: "01", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0100", b: "0000", a: "0100", addr: "00110101"};

// 47: alu:=tir; if n then goto 51;
microprograma[47] = {label: "call_j3", amux: "0", cond: "01", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0100", addr: "00110011"};


// PSHI 1111-0000
// 48: mar:=ac; rd;
microprograma[48] = {label: "pshi1", amux: "0", cond: "00", alu: "10", sh: "00", mbr: "0", mar: "1", rd: "1", wr: "0", enc: "0", c: "0000", b: "0000", a: "0001", addr: "00000000"};

// 49: sp:=sp + (-1); rd;
microprograma[49] = {label: "pshi2", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "1", wr: "0", enc: "1", c: "0010", b: "0010", a: "0111", addr: "00000000"};

// 50: mar:=sp; wr; goto 0;
microprograma[50] = {label: "pshi3 g10", amux: "0", cond: "11", alu: "10", sh: "00", mbr: "0", mar: "1", rd: "0", wr: "1", enc: "0", c: "0000", b: "0000", a: "0010", addr: "00001010"};


// POPI 1111-0010
// 51: mar:=sp; sp:=sp + 1; rd;
microprograma[51] = {label: "popi1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "1", rd: "1", wr: "0", enc: "1", c: "0010", b: "0010", a: "0110", addr: "00000000"};

// 52: mar:=ac; wr; goto 0;
microprograma[52] = {label: "popi3 g10", amux: "0", cond: "11", alu: "10", sh: "00", mbr: "0", mar: "1", rd: "0", wr: "1", enc: "0", c: "0000", b: "0000", a: "0001", addr: "00001010"};

// 53: alu:=tir; if n then goto 56;
microprograma[53] = {label: "popi_j1 n62", amux: "0", cond: "01", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0100", addr: "00111000"};


// PUSH 1111-0100
// 53: sp:=sp + (-1);
microprograma[53] = {label: "push1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0010", b: "0010", a: "0111", addr: "00000000"};

// 55: mar:=sp; mbr:=ac; wr; goto 0;
microprograma[55] = {label: "push2 g10", amux: "0", cond: "11", alu: "10", sh: "00", mbr: "1", mar: "1", rd: "0", wr: "1", enc: "0", c: "0000", b: "0010", a: "0001", addr: "00001010"};


// POP 1111-0110
// 56: mar:=sp; sp:=sp + 1; rd;
microprograma[56] = {label: "pop1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "1", rd: "1", wr: "0", enc: "1", c: "0010", b: "0010", a: "0110", addr: "00000000"};

// 57: ac:=mbr; goto 0;
microprograma[57] = {label: "pop3 g0", amux: "1", cond: "11", alu: "10", sh: "00", mbr: "1", mar: "0", rd: "0", wr: "0", enc: "1", c: "0001", b: "0000", a: "0000", addr: "00000000"};

// 58: tir:=lshift(tir); if n then goto 64;
microprograma[58] = {label: "pop_j1", amux: "0", cond: "01", alu: "10", sh: "01", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0100", b: "0000", a: "0100", addr: "01000000"};

// 59: alu:=tir; if n then goto 62;
microprograma[59] = {label: "pop_j2", amux: "0", cond: "01", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0100", addr: "00111110"};


// RETN 1111-1000
// 60: mar:=sp; sp:=sp + 1; rd;
microprograma[60] = {label: "retn1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "1", rd: "1", wr: "0", enc: "1", c: "0010", b: "0010", a: "0110", addr: "00000000"};

// 61: pc:=mbr; goto 0;
microprograma[61] = {label: "retn3 g0", amux: "1", cond: "11", alu: "10", sh: "00", mbr: "1", mar: "0", rd: "0", wr: "0", enc: "1", c: "0000", b: "0000", a: "0000", addr: "00000000"};


// SWAP 1111-1010
// 62: a:=ac;
microprograma[62] = {label: "swap1", amux: "0", cond: "00", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "1010", b: "0000", a: "0001", addr: "00000000"};

// 63: ac:=sp;
microprograma[63] = {label: "swap2", amux: "0", cond: "00", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0001", b: "0000", a: "0010", addr: "00000000"};

// 64: sp:=a; goto 0;
microprograma[64] = {label: "swap3 g0", amux: "0", cond: "11", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0010", b: "0000", a: "1010", addr: "00000000"};

// 65: alu:=tir; if n then goto 68;
microprograma[65] = {label: "swap_j1", amux: "0", cond: "01", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0100", addr: "01000100"};


// INSP 1111-1100
// 66: a:=band(ir, smask);
microprograma[66] = {label: "insp1", amux: "0", cond: "00", alu: "01", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "1010", b: "0011", a: "1001", addr: "00000000"};

// 67: sp:=sp + a; goto 0;
microprograma[67] = {label: "insp2 g0", amux: "0", cond: "11", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0010", b: "0010", a: "1010", addr: "00000000"};


// DESP 1111-1110
// 68: a:=band(ir, smask);
microprograma[68] = {label: "desp1", amux: "0", cond: "00", alu: "01", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "1010", b: "0011", a: "1001", addr: "00000000"};

// 69: a:=inv(a);
microprograma[69] = {label: "desp2", amux: "0", cond: "00", alu: "11", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "1010", b: "0000", a: "1010", addr: "00000000"};

// 70: a:=a + 1; goto 67;
microprograma[70] = {label: "desp3", amux: "0", cond: "11", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "1010", b: "1010", a: "0110", addr: "01000011"};



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
