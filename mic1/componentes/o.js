// Bloco O

// Descrição: Monta o próximo endereço para o mpc salvar

class O {
    constructor() {
        this.mbr = "00000000"; // MBR
        this.addr = "00000000"; // Addr
        this.jmpc = "0"; // Bit JMPC do MIR
    }

    // Recebe dado do MBR e MIR (Addr e J)
    write(regName, newValue) {
        this[regName] = newValue;
    }

    // Envia para MPC o endereço é o MBR (desvio para opcode) ou o endereço são os 8 bits vindos do MIR (NEXT_ADDRESS)
    read() {
        if (this.jmpc === "1") {
            return this.mbr;
        }
        return this.addr;
    }

    clear() {
        this.mbr = "00000000";
        this.addr = "00000000";
        this.jmpc = "0";
    }
}

export default O;