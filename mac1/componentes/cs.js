// Control Store - Memória de Controle (controlStore.js)

// Descrição: Memória ROM interna de 512 posições que armazena o microprograma (firmware) do processador.
// Recebe: Endereços de 9 bits vindos do MPC.
// Envia: A microinstrução correspondente para o MIR.

// Microprograma do IJVM - As 78 Microinstruções baseado no microcódigo do Mac-1 (Tanenbaum, Organização Estruturada de Computadores)

const microprograma = [];

// MICROPROGRAMA DO MAC-1 (Sinais: 1=PC, 2=AC, 3=SP, 7=MBR)

// CICLO DE BUSCA (FETCH)
// 0: mar:=pc; rd;
microprograma[0] = {label: "fetch1", addr: "0001", alu: "11", sh: "00", mar: "1", rd: "1", b: "0001", c: "0000"};

// 1: pc:=pc + 1; rd;
microprograma[1] = {label: "fetch2", addr: "0010", alu: "11", sh: "00", c: "0001", rd: "1", b: "0001"}; // c:0001 é PC no DecoderC

// 2: ir:=mbr; if n then goto 28;
microprograma[2] = {label: "fetch3", addr: "0011", alu: "11", sh: "00", c: "0000", b: "0111"};

// 3: tir:=lshift(ir + ir); if n then goto 19;
microprograma[3] = { addr: "0100", alu: "11", sh: "11", c: "0000", b: "0101" };

// 4: tir:=lshift(tir); if n then goto 11;
microprograma[4] = { addr: "0101", alu: "11", sh: "11", c: "0000", b: "0110" };

// 5: alu:=tir; if n then goto 9;
microprograma[5] = { addr: "0110", alu: "11", sh: "00", c: "0000", b: "0110" };


// LODD 0000
// 6: mar:=ir; rd;
microprograma[6] = { label: "lodd1", addr: "0111", alu: "11", sh: "00", mar: "1", rd: "1", b: "0101" };

// 7: rd;
microprograma[7] = { label: "lodd2", addr: "1000", alu: "11", sh: "00", rd: "1", b: "0000" };

// 8: ac:=mbr; goto 0;
microprograma[8] = { label: "lodd3", addr: "0000", alu: "11", sh: "00", c: "1000", b: "0111" };


// STOD 0001
// 9: mar:=ir; mbr:=ac; wr;
microprograma[9] = { label: "stod1", addr: "1001", alu: "11", sh: "00", mar: "1", b: "0101" };

// 10: wr; goto 0;
microprograma[10] = { label: "stod2", addr: "0000", alu: "11", sh: "00", mbr: "1", wr: "1", b: "0010", c: "0000" };

// 11: alu:=tir; if n then goto 15;
microprograma[11] = { addr: "1100", alu: "11", sh: "00", b: "0110" };


// ADDD 0010
// 12: mar:=ir; rd;
microprograma[12] = { label: "addd1", addr: "1101", alu: "11", sh: "00", mar: "1", rd: "1", b: "0101" };

// 13: rd;
microprograma[13] = { label: "addd2", addr: "1110", alu: "11", sh: "00", rd: "1", b: "0010" };

// 14: ac:=mbr + ac; goto 0;
microprograma[14] = { label: "addd3", addr: "0000", alu: "11", sh: "00", c: "1000", b: "0111" };


// SUBD 0011
// 15: mar:=ir; rd;
microprograma[15] = { label: "subd1", addr: "0000", alu: "11", sh: "00", mar: "1", rd: "1", b: "0101" };

// 16: ac:=ac + 1; rd;
microprograma[16] = { label: "subd2", addr: "0001", alu: "11", sh: "00", c: "1000", rd: "1", b: "0010" };

// 17: a:=inv(mbr);
microprograma[17] = { label: "subd3", addr: "0010", alu: "10", sh: "00", b: "0111" };

// 18: ac:=ac + a; goto 0;
microprograma[18] = { label: "subd4", addr: "0000", alu: "11", sh: "00", c: "1000", b: "0010" };

// 19: tir:=lshift(tir); if n then goto 25;
microprograma[19] = { addr: "0100", alu: "11", sh: "11", b: "0110" };

// 20: alu:=tir; if n then goto 23;
microprograma[20] = { addr: "0101", alu: "11", sh: "00", b: "0110" };


// JPOS 0100
// 21: alu:=ac; if n then goto 0;
microprograma[21] = { label: "jpos", addr: "0110", alu: "11", sh: "00", b: "0010" };

// 22: pc:=band(ir, amask); goto 0;
microprograma[22] = { label: "jump_target", addr: "0000", alu: "11", sh: "00", c: "0100", b: "0100" };


// JZER 0101
// 23: alu:=ac; if z then goto 22;
microprograma[23] = { label: "jzer", addr: "1000", alu: "11", sh: "00", b: "0010" };

// 24: goto 0;
microprograma[24] = { addr: "0000", alu: "11", sh: "00", b: "0000" };

// 25: alu:=tir; if n then goto 27;
microprograma[25] = { addr: "1010", alu: "11", sh: "00", b: "0110" };


// JUMP 0110
// 26: pc:=band(ir, amask); goto 0;
microprograma[26] = { label: "jump", addr: "0000", alu: "11", sh: "00", c: "0100", b: "0100" };


// LOCO 0111
// 27: ac:=band(ir, amask); goto 0;
microprograma[27] = { label: "loco", addr: "0000", alu: "11", sh: "00", c: "1000", b: "0100" };

// 28: tir:=lshift(ir + ir); if n then goto 40;
microprograma[28] = { addr: "1101", alu: "11", sh: "11", c: "0000", b: "0101" };

// 29: tir:=lshift(tir); if n then goto 35;
microprograma[29] = { addr: "1110", alu: "11", sh: "11", c: "0000", b: "0110" };

// 30: alu:=tir; if n then goto 33;
microprograma[30] = { addr: "1111", alu: "11", sh: "00", c: "0000", b: "0110" };


// LODL 1000
// 31: a:=ir + sp;
microprograma[31] = { label: "lodl1", addr: "0000", alu: "11", sh: "00", c: "0000", b: "0101" };

// 32: mar:=a; rd; goto 7;
microprograma[32] = { label: "lodl2", addr: "0111", alu: "11", sh: "00", mar: "1", rd: "1", b: "0000" };


// STOL 1001
// 33: a:=ir + sp;
microprograma[33] = { label: "stol1", addr: "0010", alu: "11", sh: "00", c: "0000", b: "0101" };

// 34: mar:=a; mbr:=ac; wr; goto 10;
microprograma[34] = { label: "stol2", addr: "1001", alu: "11", sh: "00", mar: "1", b: "0000" };

// 35: alu:=tir; if n then goto 38;
microprograma[35] = { addr: "0100", alu: "11", sh: "00", b: "0110" };


// ADDL 1010
// 36: a:=ir + sp;
microprograma[36] = { label: "addl1", addr: "0101", alu: "11", sh: "00", c: "0000", b: "0101" };

// 37: mar:=a; rd; goto 13;
microprograma[37] = { label: "addl2", addr: "1101", alu: "11", sh: "00", mar: "1", rd: "1", b: "0000" };


// SUBL 1011
// 38: a:=ir + sp;
microprograma[38] = { label: "subl1", addr: "0111", alu: "11", sh: "00", c: "0000", b: "0101" };

// 39: mar:=a; rd; goto 16;
microprograma[39] = { label: "subl2", addr: "0000", alu: "11", sh: "00", mar: "1", rd: "1", b: "0000" };

// 40: tir:=lshift(tir); if n then goto 46;
microprograma[40] = { addr: "1001", alu: "11", sh: "11", b: "0110" };

// 41: alu:=tir; if n then goto 44;
microprograma[41] = { addr: "1010", alu: "11", sh: "00", b: "0110" };


// JNEG 1100
// 42: alu:=ac; if n then goto 22;
microprograma[42] = { label: "jneg", addr: "1011", alu: "11", sh: "00", b: "0010" };

// 43: goto 0;
microprograma[43] = { addr: "0000", alu: "11", sh: "00", b: "0000" };


// JNZE 1101
// 44: alu:=ac; if z then goto 0;
microprograma[44] = { label: "jnze", addr: "1101", alu: "11", sh: "00", b: "0010" };

// 45: pc:=band(ir, amask); goto 0;
microprograma[45] = { label: "jnze_jump", addr: "0000", alu: "11", sh: "00", c: "0100", b: "0100" };

// 46: tir:=lshift(tir); if n then goto 50;
microprograma[46] = { addr: "1111", alu: "11", sh: "11", b: "0110" };


// CALL 1110
// 47: sp:=sp + (-1);
microprograma[47] = { label: "call1", addr: "0000", alu: "11", sh: "00", b: "0011" };

// 48: mar:=sp; mbr:=pc; wr;
microprograma[48] = { label: "call2", addr: "0001", alu: "11", sh: "00", mar: "1", mbr: "1", wr: "1", b: "0011" };

// 49: pc:=band(ir, amask); wr; goto 0;
microprograma[49] = { label: "call3", addr: "0000", alu: "11", sh: "00", c: "0100", wr: "1", b: "0100" };

// 50: tir:=lshift(tir); if n then goto 65;
microprograma[50] = { addr: "0011", alu: "11", sh: "11", b: "0110" };

// 51: tir:=lshift(tir); if n then goto 59;
microprograma[51] = { addr: "0100", alu: "11", sh: "11", b: "0110" };

// 52: alu:=tir; if n then goto 56;
microprograma[52] = { addr: "0101", alu: "11", sh: "00", b: "0110" };


// PSHI 1111-0000
// 53: mar:=ac; rd;
microprograma[53] = { label: "pshi1", addr: "0110", alu: "11", sh: "00", mar: "1", rd: "1", b: "0010" };

// 54: sp:=sp + (-1); rd;
microprograma[54] = { label: "pshi2", addr: "0111", alu: "11", sh: "00", rd: "1", b: "0011" };

// 55: mar:=sp; wr; goto 10;
microprograma[55] = { label: "pshi3", addr: "1001", alu: "11", sh: "00", mar: "1", wr: "1", b: "0011" };


// POPI 1111-0010
// 56: mar:=sp; sp:=sp + 1; rd;
microprograma[56] = { label: "popi1", addr: "1001", alu: "11", sh: "00", mar: "1", rd: "1", b: "0011" };

// 57: rd;
microprograma[57] = { label: "popi2", addr: "1010", alu: "11", sh: "00", rd: "1", b: "0000" };

// 58: mar:=ac; wr; goto 10;
microprograma[58] = { label: "popi3", addr: "1001", alu: "11", sh: "00", mar: "1", wr: "1", b: "0010" };

// 59: alu:=tir; if n then goto 62;
microprograma[59] = { addr: "1100", alu: "11", sh: "00", b: "0110" };


// PUSH 1111-0100
// 60: sp:=sp + (-1);
microprograma[60] = { label: "push1", addr: "1101", alu: "11", sh: "00", b: "0011" };

// 61: mar:=sp; mbr:=ac; wr; goto 10;
microprograma[61] = { label: "push2", addr: "1001", alu: "11", sh: "00", mar: "1", mbr: "1", wr: "1", b: "0011" };


// POP 1111-0110
// 62: mar:=sp; sp:=sp + 1; rd;
microprograma[62] = { label: "pop1", addr: "1111", alu: "11", sh: "00", mar: "1", rd: "1", b: "0011" };

// 63: rd;
microprograma[63] = { label: "pop2", addr: "0000", alu: "11", sh: "00", rd: "1", b: "0000" };

// 64: ac:=mbr; goto 0;
microprograma[64] = { label: "pop3", addr: "0000", alu: "11", sh: "00", c: "1000", b: "0111" };

// 65: tir:=lshift(tir); if n then goto 73;
microprograma[65] = { addr: "0010", alu: "11", sh: "11", b: "0110" };

// 66: alu:=tir; if n then goto 70;
microprograma[66] = { addr: "0011", alu: "11", sh: "00", b: "0110" };


// RETN 1111-1000
// 67: mar:=sp; sp:=sp + 1; rd;
microprograma[67] = { label: "retn1", addr: "0100", alu: "11", sh: "00", mar: "1", rd: "1", b: "0011" };

// 68: rd;
microprograma[68] = { label: "retn2", addr: "0101", alu: "11", sh: "00", rd: "1", b: "0000" };

// 69: pc:=mbr; goto 0;
microprograma[69] = { label: "retn3", addr: "0000", alu: "11", sh: "00", c: "0100", b: "0111" };


// SWAP 1111-1010
// 70: a:=ac;
microprograma[70] = { label: "swap1", addr: "0111", alu: "11", sh: "00", b: "0010" };

// 71: ac:=sp;
microprograma[71] = { label: "swap2", addr: "1000", alu: "11", sh: "00", c: "1000", b: "0011" };

// 72: sp:=a; goto 0;
microprograma[72] = { label: "swap3", addr: "0000", alu: "11", sh: "00", b: "0000" };

// 73: alu:=tir; if n then goto 76;
microprograma[73] = { addr: "1010", alu: "11", sh: "00", b: "0110" };


// INSP 1111-1100
// 74: a:=band(ir, smask);
microprograma[74] = { label: "insp1", addr: "1011", alu: "11", sh: "00", b: "0100" };

// 75: sp:=sp + a; goto 0;
microprograma[75] = { label: "insp2", addr: "0000", alu: "11", sh: "00", b: "0011" };


// DESP 1111-1110
// 76: a:=band(ir, smask);
microprograma[76] = { label: "desp1", addr: "1101", alu: "11", sh: "00", b: "0100" };

// 77: a:=inv(a);
microprograma[77] = { label: "desp2", addr: "1110", alu: "10", sh: "00", b: "0000" };

// 78: a:=a + 1; goto 75;
microprograma[78] = { label: "desp3", addr: "1011", alu: "11", sh: "00", b: "0000" };



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
