// Control Store - Armazenamento de Controle

// Descrição: Memória ROM interna de 512 posições que armazena o microprograma do processador.
// Recebe: Endereços de 9 bits vindos do MPC.
// Envia: A microinstrução correspondente para o MIR.


// ROM
const microprograma = [];

// --- Fetch (0x00 = 0) ---
// Main1: mar = pc; rd
microprograma[0] = {label: "Main1", addr: "000000001", jam: "000", ula: "010100", des: "00", c: "100000000", mem: "100", b: "0001"};
// Main2: pc = pc + 1; rd
microprograma[1] = {label: "Main2", addr: "000000010", jam: "000", ula: "110101", des: "00", c: "001000000", mem: "100", b: "0001"};
// Main3: ir = mbr; goto (mbr)
microprograma[2] = {label: "Main3", addr: "000000000", jam: "001", ula: "010100", des: "00", c: "000000000", mem: "000", b: "0010"};

// --- IADD (0x60 = 96) ---
// iadd1: mar = sp = sp - 1; rd
microprograma[96] = {label: "iadd1", addr: "001100001", jam: "000", ula: "110110", des: "00", c: "100100000", mem: "100", b: "0100"};
// iadd2: h = tos
microprograma[97] = {label: "iadd2", addr: "001100010", jam: "000", ula: "010100", des: "00", c: "000000001", mem: "000", b: "0111"};
// iadd3: mdr = tos = h + mdr; wr; goto Main1
microprograma[98] = {label: "iadd3", addr: "000000000", jam: "000", ula: "111100", des: "00", c: "010000100", mem: "010", b: "0000"};


// --- ISUB (0x64 = 100) ---
// isub1: mar = sp = sp - 1; rd
microprograma[100] = {label: "isub1", addr: "001100101", jam: "000", ula: "110110", des: "00", c: "100100000", mem: "100", b: "0100"};
// isub2: h = tos
microprograma[101] = {label: "isub2", addr: "001100110", jam: "000", ula: "010100", des: "00", c: "000000001", mem: "000", b: "0111"};
// isub3: mdr = tos = h - mdr; wr; goto Main1
microprograma[102] = {label: "isub3", addr: "000000000", jam: "000", ula: "111111", des: "00", c: "010000100", mem: "010", b: "0000"};

// ... (Repetir a alteração de ula: "111111" para "110111" em iand1, ior1, pop1, ifeq1 e iflt1)

// --- IAND (0x7E = 126) ---
// iand1: mar = sp = sp - 1; rd
microprograma[126] = {label: "iand1", addr: "001111111", jam: "000", ula: "110110", des: "00", c: "100100000", mem: "100", b: "0100"};
// iand2: h = tos
microprograma[127] = {label: "iand2", addr: "010000000", jam: "000", ula: "010100", des: "00", c: "000000001", mem: "000", b: "0111"};
// iand3: mdr = tos = h & mdr; wr; goto Main1
microprograma[128] = {label: "iand3", addr: "000000000", jam: "000", ula: "001100", des: "00", c: "010000100", mem: "010", b: "0000"};


// --- IOR (0xB0 = 176) ---
// ior1: mar = sp = sp - 1; rd
microprograma[176] = {label: "ior1", addr: "010110001", jam: "000", ula: "110110", des: "00", c: "100100000", mem: "100", b: "0100"};
// ior2: h = tos
microprograma[177] = {label: "ior2", addr: "010110010", jam: "000", ula: "010100", des: "00", c: "000000001", mem: "000", b: "0111"};
// ior3: mdr = tos = h | mdr; wr; goto Main1
microprograma[178] = {label: "ior3", addr: "000000000", jam: "000", ula: "011100", des: "00", c: "010000100", mem: "010", b: "0000"};


// --- DUP (0x59 = 89) ---
// dup1: mar = sp = sp + 1
microprograma[89] = {label: "dup1", addr: "001011010", jam: "000", ula: "110101", des: "00", c: "100100000", mem: "000", b: "0100"};
// dup2: mdr = tos; wr; goto Main1
microprograma[90] = {label: "dup2", addr: "000000000", jam: "000", ula: "010100", des: "00", c: "010000000", mem: "010", b: "0111"};


// --- POP (0x57 = 87) ---
// pop1: mar = sp = sp - 1; rd
microprograma[87] = {label: "pop1", addr: "001011000", jam: "000", ula: "110110", des: "00", c: "100100000", mem: "100", b: "0100"};
// pop2: aguarda leitura da memória
microprograma[88] = {label: "pop2", addr: "010010110", jam: "000", ula: "010100", des: "00", c: "000000000", mem: "000", b: "0000"};
// pop3: tos = mdr; goto Main1
microprograma[150] = {label: "pop3", addr: "000000000", jam: "000", ula: "010100", des: "00", c: "000000100", mem: "000", b: "0000"};


// --- BIPUSH (0x10 = 16) ---
// bipush1: pc = pc + 1; mar = pc; rd
microprograma[16] = {label: "bipush1", addr: "000010001", jam: "000", ula: "110101", des: "00", c: "101000000", mem: "100", b: "0001"};
// bipush2: aguarda leitura da memória
microprograma[17] = {label: "bipush2", addr: "000010010", jam: "000", ula: "010100", des: "00", c: "000000000", mem: "100", b: "0000"};
// bipush3: mdr = mbr
microprograma[18] = {label: "bipush3", addr: "011001000", jam: "000", ula: "010100", des: "00", c: "010000000", mem: "000", b: "0010"};
microprograma[200] = {label: "bipush4", addr: "011001001", jam: "000", ula: "110101", des: "00", c: "100100000", mem: "010", b: "0100"};
microprograma[201] = {label: "bipush5", addr: "011001010", jam: "000", ula: "010100", des: "00", c: "000000100", mem: "000", b: "0000"};
// bipush6: pc = pc + 1; goto Main1
microprograma[202] = {label: "bipush6", addr: "000000000", jam: "000", ula: "110101", des: "00", c: "001000000", mem: "000", b: "0001"};


// --- SWAP (0x5F = 95) ---
microprograma[95] = {label: "swap1", addr: "010110100", jam: "000", ula: "111111", des: "00", c: "100000000", mem: "100", b: "0100"};
microprograma[180] = {label: "swap2", addr: "010110101", jam: "000", ula: "010100", des: "00", c: "000000001", mem: "000", b: "0111"};
microprograma[181] = {label: "swap3", addr: "010110110", jam: "000", ula: "010100", des: "00", c: "010000000", mem: "010", b: "0111"};
microprograma[182] = {label: "swap4", addr: "010110111", jam: "000", ula: "010100", des: "00", c: "000000100", mem: "000", b: "0001"};
microprograma[183] = {label: "swap5", addr: "000000000", jam: "000", ula: "010100", des: "00", c: "100000000", mem: "010", b: "0100"};


// --- ILOAD (0x15 = 21) ---
microprograma[21] = {label: "iload1", addr: "000010110", jam: "000", ula: "110101", des: "00", c: "001100000", mem: "100", b: "0001"};
microprograma[22] = {label: "iload2", addr: "000010111", jam: "000", ula: "010100", des: "00", c: "000000001", mem: "000", b: "0101"};
microprograma[23] = {label: "iload3", addr: "000011000", jam: "000", ula: "111100", des: "00", c: "100000000", mem: "100", b: "0010"};
microprograma[24] = {label: "iload4", addr: "000011001", jam: "000", ula: "010100", des: "00", c: "000000000", mem: "000", b: "0000"};
microprograma[25] = {label: "iload5", addr: "000011010", jam: "000", ula: "010100", des: "00", c: "010000000", mem: "000", b: "0000"};
microprograma[26] = {label: "iload6", addr: "000000000", jam: "000", ula: "110101", des: "00", c: "100100100", mem: "010", b: "0100"};


// --- ISTORE (0x36 = 54) ---
microprograma[54] = {label: "istore1", addr: "000110111", jam: "000", ula: "110101", des: "00", c: "001100000", mem: "100", b: "0001"};
microprograma[55] = {label: "istore2", addr: "000111000", jam: "000", ula: "010100", des: "00", c: "000000001", mem: "010", b: "0101"};
microprograma[56] = {label: "istore3", addr: "000111001", jam: "000", ula: "111100", des: "00", c: "101000000", mem: "010", b: "0010"};
microprograma[57] = {label: "istore4", addr: "000111010", jam: "000", ula: "110110", des: "00", c: "100100000", mem: "100", b: "0100"};
microprograma[58] = {label: "istore5", addr: "000111011", jam: "000", ula: "010100", des: "00", c: "000000000", mem: "000", b: "0000"};
microprograma[59] = {label: "istore6", addr: "000000000", jam: "000", ula: "010100", des: "00", c: "000000100", mem: "000", b: "0000"};


// --- GOTO (0xA7 = 167) ---
microprograma[167] = {label: "goto1", addr: "010101000", jam: "000", ula: "110101", des: "00", c: "001100000", mem: "100", b: "0001"};
microprograma[168] = {label: "goto2", addr: "010101001", jam: "000", ula: "010100", des: "10", c: "000000001", mem: "000", b: "0010"};
microprograma[169] = {label: "goto3", addr: "010101010", jam: "000", ula: "110101", des: "00", c: "001100000", mem: "100", b: "0001"};
microprograma[170] = {label: "goto4", addr: "010101011", jam: "000", ula: "011100", des: "00", c: "000000001", mem: "000", b: "0010"};
microprograma[171] = {label: "goto5", addr: "010101100", jam: "000", ula: "111111", des: "00", c: "001000000", mem: "000", b: "0001"};
microprograma[172] = {label: "goto6", addr: "000000001", jam: "000", ula: "010100", des: "00", c: "100000000", mem: "100", b: "0010"};


// --- IFEQ (0x99 = 153) ---
microprograma[153] = {label: "ifeq1", addr: "010011010", jam: "000", ula: "110110", des: "00", c: "100100000", mem: "100", b: "0100"};
microprograma[154] = {label: "ifeq2", addr: "010111110", jam: "000", ula: "010100", des: "00", c: "000000000", mem: "000", b: "0000"};
microprograma[190] = {label: "ifeq3", addr: "010111111", jam: "000", ula: "010100", des: "00", c: "000000100", mem: "000", b: "0000"};
microprograma[191] = {label: "ifeq4", addr: "000000000", jam: "010", ula: "010100", des: "00", c: "000000000", mem: "000", b: "0111"};

// --- IFLT (0x9B = 155) ---
// Nota: Movido para endereço livre devido a colisão com IFEQ
microprograma[155] = {label: "iflt1", addr: "011001011", jam: "000", ula: "110110", des: "00", c: "100100000", mem: "100", b: "0100"};
microprograma[203] = {label: "iflt2", addr: "011001100", jam: "000", ula: "010100", des: "00", c: "000000000", mem: "000", b: "0000"};
microprograma[204] = {label: "iflt3", addr: "011001101", jam: "000", ula: "010100", des: "00", c: "000000100", mem: "000", b: "0000"};
microprograma[205] = {label: "iflt4", addr: "000000000", jam: "100", ula: "010100", des: "00", c: "000000000", mem: "000", b: "0111"};


// Armazenamento de Controle

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
