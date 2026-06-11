// Control Store - Memória de Controle (controlStore.js)

// Descrição: Memória ROM interna de 512 posições que armazena o microprograma (firmware) do processador.
// Recebe: Endereços de 9 bits vindos do MPC.
// Envia: A microinstrução correspondente para o MIR.

// Microprograma do IJVM - As 78 Microinstruções baseado no microcódigo do Mac-1 (Tanenbaum, Organização Estruturada de Computadores)

const microprograma = [];

// MICROPROGRAMA DO MAC-1

// CICLO DE BUSCA (FETCH)
// 0: mar:=pc; rd;
microprograma[0] = {label: "0: fetch1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "1", rd: "1", wr: "0", enc: "0", c: "0000", b: "0000", a: "0000", addr: "00000000"};

// 1: pc:=pc + 1; rd;
microprograma[1] = {label: "1: fetch2", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "1", wr: "0", enc: "1", c: "0000", b: "0000", a: "0110", addr: "00000000"};

// 2: ir:=mbr; if n then goto 28;
microprograma[2] = {label: "2: fetch3 n28", amux: "1", cond: "01", alu: "10", sh: "00", mbr: "1", mar: "0", rd: "1", wr: "0", enc: "1", c: "0011", b: "0000", a: "0000", addr: "00011100"};

// 3: tir:=lshift(ir + ir); if n then goto 19;
microprograma[3] = {label: "3: fetch4 n19", amux: "0", cond: "01", alu: "00", sh: "01", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0100", b: "0011", a: "0011", addr: "00010011"};

// 4: tir:=lshift(tir); if n then goto 11;
microprograma[4] = {label: "4: fetch5 n11", amux: "0", cond: "01", alu: "10", sh: "01", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0100", b: "0000", a: "0100", addr: "00001011"};

// 5: alu:=tir; if n then goto 9;
microprograma[5] = {label: "5: fetch6 n9", amux: "0", cond: "01", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0100", b: "0000", a: "0100", addr: "00001001"};


// LODD 0000
// 6: mar:=ir; rd;
microprograma[6] = {label: "6: lodd1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "1", rd: "1", wr: "0", enc: "0", c: "0000", b: "0011", a: "0000", addr: "00000000"};

// 7: rd;
microprograma[7] = {label: "7: lodd2", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "1", wr: "0", enc: "0", c: "0000", b: "0000", a: "0000", addr: "00000000"};

// 8: ac:=mbr; goto 0;
microprograma[8] = {label: "8: lodd3 g0", amux: "1", cond: "11", alu: "10", sh: "00", mbr: "1", mar: "0", rd: "0", wr: "0", enc: "1", c: "0001", b: "0000", a: "0000", addr: "00000000"};


// STOD 0001
// 9: mar:=ir; mbr:=ac; wr;
microprograma[9] = {label: "9: stod1", amux: "0", cond: "00", alu: "10", sh: "00", mbr: "1", mar: "1", rd: "0", wr: "1", enc: "0", c: "0000", b: "0011", a: "0001", addr: "00000000"};

// 10: wr; goto 0;
microprograma[10] = {label: "10: stod2 g0", amux: "0", cond: "11", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "1", enc: "0", c: "0000", b: "0010", a: "0000", addr: "00000000"};

// 11: alu:=tir; if n then goto 15;
microprograma[11] = {label: "11: stod_j1 n15", amux: "0", cond: "01", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0100", addr: "00001111"};


// ADDD 0010
// 12: mar:=ir; rd;
microprograma[12] = {label: "12: addd1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "1", rd: "1", wr: "0", enc: "0", c: "0000", b: "0011", a: "0000", addr: "00000000"};

// 13: rd;
microprograma[13] = {label: "13: addd2", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "1", wr: "0", enc: "0", c: "0000", b: "0000", a: "0000", addr: "00000000"};

// 14: ac:=mbr + ac; goto 0;
microprograma[14] = {label: "14: addd3 g0", amux: "1", cond: "11", alu: "00", sh: "00", mbr: "1", mar: "0", rd: "0", wr: "0", enc: "1", c: "0001", b: "0001", a: "0000", addr: "00000000"};


// SUBD 0011
// 15: mar:=ir; rd;
microprograma[15] = {label: "15: subd1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "1", rd: "1", wr: "0", enc: "0", c: "0000", b: "0011", a: "0000", addr: "00000000" };

// 16: ac:=ac + 1; rd;
microprograma[16] = {label: "16: subd2", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "1", wr: "0", enc: "1", c: "0001", b: "0001", a: "0110", addr: "00000000"};

// 17: a:=inv(mbr);
microprograma[17] = {label: "17: subd3", amux: "1", cond: "00", alu: "11", sh: "00", mbr: "1", mar: "0", rd: "0", wr: "0", enc: "1", c: "1010", b: "0000", a: "0000", addr: "00000000"};

// 18: ac:=ac + a; goto 0;
microprograma[18] = {label: "18: subd4 g0", amux: "0", cond: "11", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0001", b: "0001", a: "1010", addr: "00000000"};

// 19: tir:=lshift(tir); if n then goto 25;
microprograma[19] = {label: "19: subd_j1 n25", amux: "0", cond: "01", alu: "10", sh: "01", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0100", b: "0000", a: "0100", addr: "00011001"};

// 20: alu:=tir; if n then goto 23;
microprograma[20] = {label: "20: subd_j2 n23", amux: "0", cond: "01", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0100", addr: "00010111"};


// JPOS 0100
// 21: alu:=ac; if n then goto 0;
microprograma[21] = {label: "21: jpos n0", amux: "0", cond: "01", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0001", addr: "00000000"};

// 22: pc:=band(ir, amask); goto 0;
microprograma[22] = {label: "22: jpos_target g0", amux: "0", cond: "11", alu: "01", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0000", b: "0011", a: "1000", addr: "00000000"};


// JZER 0101
// 23: alu:=ac; if z then goto 22;
microprograma[23] = {label: "23: jzer z22", amux: "0", cond: "10", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0001", addr: "00010110"};

// 24: goto 0;
microprograma[24] = {label: "24: jzer_else g0", amux: "0", cond: "11", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0000", addr: "00000000"};

// 25: alu:=tir; if n then goto 27;
microprograma[25] = {label: "25: jzer_j1 n27", amux: "0", cond: "01", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0100", addr: "00011011"};


// JUMP 0110
// 26: pc:=band(ir, amask); goto 0;
microprograma[26] = {label: "26: jump g0", amux: "0", cond: "11", alu: "01", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0000", b: "0011", a: "1000", addr: "00000000"};


// LOCO 0111
// 27: ac:=band(ir, amask); goto 0;
microprograma[27] = {label: "27: loco g0", amux: "0", cond: "11", alu: "01", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0001", b: "0011", a: "1000", addr: "00000000"};

// 28: tir:=lshift(ir + ir); if n then goto 40;
microprograma[28] = {label: "28: loco_j1 n40", amux: "0", cond: "01", alu: "00", sh: "01", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0100", b: "0011", a: "0011", addr: "00101000"};

// 29: tir:=lshift(tir); if n then goto 35;
microprograma[29] = {label: "29: loco_j2 n35", amux: "0", cond: "01", alu: "10", sh: "01", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0100", b: "0000", a: "0100", addr: "00100011"};

// 30: alu:=tir; if n then goto 33;
microprograma[30] = {label: "30: loco_j3 n33", amux: "0", cond: "01", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0100", addr: "00100001"};


// LODL 1000
// 31: a:=ir + sp;
microprograma[31] = {label: "31: lodl1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "1011", b: "0011", a: "0010", addr: "00000000"};

// 32: mar:=a; rd; goto 7;
microprograma[32] = {label: "32: lodl2 g7", amux: "0", cond: "11", alu: "00", sh: "00", mbr: "0", mar: "1", rd: "1", wr: "0", enc: "0", c: "0000", b: "1011", a: "0000", addr: "00000111"};


// STOL 1001
// 33: a:=ir + sp;
microprograma[33] = {label: "33: stol1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "1011", b: "0011", a: "0010", addr: "00000000"};

// 34: mar:=a; mbr:=ac; wr; goto 10;
microprograma[34] = {label: "34: stol2 g10", amux: "0", cond: "11", alu: "10", sh: "00", mbr: "1", mar: "1", rd: "0", wr: "1", enc: "0", c: "0000", b: "1011", a: "0001", addr: "00001010"};

// 35: alu:=tir; if n then goto 38;
microprograma[35] = {label: "35: stol_j n38", amux: "0", cond: "01", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0100", addr: "00100110"};


// ADDL 1010
// 36: a:=ir + sp;
microprograma[36] = {label: "36: addl1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "1011", b: "0011", a: "0010", addr: "00000000"};

// 37: mar:=a; rd; goto 13;
microprograma[37] = {label: "37: addl2 g13", amux: "0", cond: "11", alu: "10", sh: "00", mbr: "0", mar: "1", rd: "1", wr: "0", enc: "0", c: "0000", b: "1011", a: "0000", addr: "00001101"};


// SUBL 1011
// 38: a:=ir + sp;
microprograma[38] = {label: "38: subl1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "1011", b: "0011", a: "0010", addr: "00000000"};

// 39: mar:=a; rd; goto 16;
microprograma[39] = {label: "39: subl2 g16", amux: "0", cond: "11", alu: "10", sh: "00", mbr: "0", mar: "1", rd: "1", wr: "0", enc: "0", c: "0000", b: "1011", a: "0000", addr: "00010000"};

// 40: tir:=lshift(tir); if n then goto 46;
microprograma[40] = {label: "40: subl_j1 n46", amux: "0", cond: "01", alu: "10", sh: "01", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0100", b: "0000", a: "0100", addr: "00101110"};

// 41: alu:=tir; if n then goto 44;
microprograma[41] = {label: "41: subl_j2 n44", amux: "0", cond: "01", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0100", addr: "00101100"};


// JNEG 1100
// 42: alu:=ac; if n then goto 22;
microprograma[42] = {label: "42: jneg n22", amux: "0", cond: "01", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0001", addr: "00010110"};

// 43: goto 0;
microprograma[43] = {label: "43: jneg_else g0", amux: "0", cond: "11", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0000", addr: "00000000"};


// JNZE 1101
// 44: alu:=ac; if z then goto 0;
microprograma[44] = {label: "44: jnze z0", amux: "0", cond: "10", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0001", addr: "00000000"};

// 45: pc:=band(ir, amask); goto 0;
microprograma[45] = {label: "45: jnze_target g0", amux: "0", cond: "11", alu: "01", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0000", b: "0011", a: "1000", addr: "00000000"};

// 46: tir:=lshift(tir); if n then goto 50;
microprograma[46] = {label: "46: jnze_j n50", amux: "0", cond: "01", alu: "10", sh: "01", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0100", b: "0000", a: "0100", addr: "00110010"};


// CALL 1110
// 47: sp:=sp + (-1);
microprograma[47] = {label: "47: call1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0010", b: "0010", a: "0111", addr: "00000000"};

// 48: mar:=sp; mbr:=pc; wr;
microprograma[48] = {label: "48: call2", amux: "0", cond: "00", alu: "10", sh: "00", mbr: "1", mar: "1", rd: "0", wr: "1", enc: "0", c: "0000", b: "0010", a: "0000", addr: "00000000"};

// 49: pc:=band(ir, amask); wr; goto 0;
microprograma[49] = {label: "49: call3 g0", amux: "0", cond: "11", alu: "01", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0000", b: "0011", a: "1000", addr: "00000000"};

// 50: tir:=lshift(tir); if n then goto 65;
microprograma[50] = {label: "50: call_j1 n65", amux: "0", cond: "01", alu: "10", sh: "01", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0100", b: "0000", a: "0100", addr: "01000001"};

// 51: tir:=lshift(tir); if n then goto 59;
microprograma[51] = {label: "51: call_j2 n59", amux: "0", cond: "01", alu: "10", sh: "01", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0100", b: "0000", a: "0100", addr: "00111011"};

// 52: alu:=tir; if n then goto 56;
microprograma[52] = {label: "52: call_j3 n56", amux: "0", cond: "01", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0100", addr: "00111000"};


// PSHI 1111-0000
// 53: mar:=ac; rd;
microprograma[53] = {label: "53: pshi1", amux: "0", cond: "00", alu: "10", sh: "00", mbr: "0", mar: "1", rd: "1", wr: "0", enc: "0", c: "0000", b: "0000", a: "0001", addr: "00000000"};

// 54: sp:=sp + (-1); rd;
microprograma[54] = {label: "54: pshi2", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "1", wr: "0", enc: "1", c: "0010", b: "0010", a: "0111", addr: "00000000"};

// 55: mar:=sp; wr; goto 10;
microprograma[55] = {label: "55: pshi3 g10", amux: "0", cond: "11", alu: "10", sh: "00", mbr: "0", mar: "1", rd: "0", wr: "1", enc: "0", c: "0000", b: "0000", a: "0010", addr: "00001010"};


// POPI 1111-0010
// 56: mar:=sp; sp:=sp + 1; rd;
microprograma[56] = {label: "56: popi1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "1", rd: "1", wr: "0", enc: "1", c: "0010", b: "0010", a: "0110", addr: "00000000"};

// 57: rd;
microprograma[57] = {label: "57: popi2", amux: "0", cond: "00", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "1", wr: "0", enc: "0", c: "0000", b: "0000", a: "0000", addr: "00000000"};

// 58: mar:=ac; wr; goto 10;
microprograma[58] = {label: "58: popi3 g10", amux: "0", cond: "11", alu: "10", sh: "00", mbr: "0", mar: "1", rd: "0", wr: "1", enc: "0", c: "0000", b: "0000", a: "0001", addr: "00001010"};

// 59: alu:=tir; if n then goto 62;
microprograma[59] = {label: "59: popi_j1 n62", amux: "0", cond: "01", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0100", addr: "00111110"};


// PUSH 1111-0100
// 60: sp:=sp + (-1);
microprograma[60] = {label: "60: push1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0010", b: "0010", a: "0111", addr: "00000000"};

// 61: mar:=sp; mbr:=ac; wr; goto 10;
microprograma[61] = {label: "61: push2 g10", amux: "0", cond: "11", alu: "10", sh: "00", mbr: "1", mar: "1", rd: "0", wr: "1", enc: "0", c: "0000", b: "0010", a: "0001", addr: "00001010"};


// POP 1111-0110
// 62: mar:=sp; sp:=sp + 1; rd;
microprograma[62] = {label: "62: pop1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "1", rd: "1", wr: "0", enc: "1", c: "0010", b: "0010", a: "0110", addr: "00000000"};

// 63: rd;
microprograma[63] = {label: "63: pop2", amux: "0", cond: "00", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "1", wr: "0", enc: "0", c: "0000", b: "0000", a: "0000", addr: "00000000"};

// 64: ac:=mbr; goto 0;
microprograma[64] = {label: "64: pop3 g0", amux: "1", cond: "11", alu: "10", sh: "00", mbr: "1", mar: "0", rd: "0", wr: "0", enc: "1", c: "0001", b: "0000", a: "0000", addr: "00000000"};

// 65: tir:=lshift(tir); if n then goto 73;
microprograma[65] = {label: "65: pop_j1 n73", amux: "0", cond: "01", alu: "10", sh: "01", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0100", b: "0000", a: "0100", addr: "01001001"};

// 66: alu:=tir; if n then goto 70;
microprograma[66] = {label: "66: pop_j2 n70", amux: "0", cond: "01", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0100", addr: "01000110"};


// RETN 1111-1000
// 67: mar:=sp; sp:=sp + 1; rd;
microprograma[67] = {label: "67: retn1", amux: "0", cond: "00", alu: "00", sh: "00", mbr: "0", mar: "1", rd: "1", wr: "0", enc: "1", c: "0010", b: "0010", a: "0110", addr: "00000000"};

// 68: rd;
microprograma[68] = {label: "68: retn2", amux: "0", cond: "00", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "1", wr: "0", enc: "0", c: "0000", b: "0000", a: "0000", addr: "00000000"};

// 69: pc:=mbr; goto 0;
microprograma[69] = {label: "69: retn3 g0", amux: "1", cond: "11", alu: "10", sh: "00", mbr: "1", mar: "0", rd: "0", wr: "0", enc: "1", c: "0000", b: "0000", a: "0000", addr: "00000000"};


// SWAP 1111-1010
// 70: a:=ac;
microprograma[70] = {label: "70: swap1", amux: "0", cond: "00", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "1010", b: "0000", a: "0001", addr: "00000000"};

// 71: ac:=sp;
microprograma[71] = {label: "71: swap2", amux: "0", cond: "00", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0001", b: "0000", a: "0010", addr: "00000000"};

// 72: sp:=a; goto 0;
microprograma[72] = {label: "72: swap3 g0", amux: "0", cond: "11", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0010", b: "0000", a: "1010", addr: "00000000"};

// 73: alu:=tir; if n then goto 76;
microprograma[73] = {label: "73: swap_j1 76", amux: "0", cond: "01", alu: "10", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "0", c: "0000", b: "0000", a: "0100", addr: "01001100"};


// INSP 1111-1100
// 74: a:=band(ir, smask);
microprograma[74] = {label: "74: insp1", amux: "0", cond: "00", alu: "01", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "1010", b: "0011", a: "1001", addr: "00000000"};

// 75: sp:=sp + a; goto 0;
microprograma[75] = {label: "75: insp2 g0", amux: "0", cond: "11", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "0010", b: "0010", a: "1010", addr: "00000000"};


// DESP 1111-1110
// 76: a:=band(ir, smask);
microprograma[76] = {label: "76: desp1", amux: "0", cond: "00", alu: "01", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "1010", b: "0011", a: "1001", addr: "00000000"};

// 77: a:=inv(a);
microprograma[77] = {label: "77: desp2", amux: "0", cond: "00", alu: "11", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "1010", b: "0000", a: "1010", addr: "00000000"};

// 78: a:=a + 1; goto 75;
microprograma[78] = {label: "78: desp3 g75", amux: "0", cond: "11", alu: "00", sh: "00", mbr: "0", mar: "0", rd: "0", wr: "0", enc: "1", c: "1010", b: "1010", a: "0110", addr: "01001011"};



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
