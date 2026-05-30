// Jump - Bit Alto

// Descrição: Indica os saltos no código.

class Jump {
    constructor() {
        this.flagZ = "0";
        this.flagN = "0"; 
        this.mir = "00";
        this.addr8 = "0";
    }

    // Recebe o bit da N ou Z da ULA e o JAM do MIR
    write(flagName, newValue) {
        this[flagName] = newValue;
    }

    // Envia para Bit para MPC
    read() {
        const jamn = parseInt(this.mir[0]);
        const jamz = parseInt(this.mir[1]);
        
        const z = parseInt(this.flagZ);
        const n = parseInt(this.flagN);

        // Lógica: (JAMZ AND Z) OR (JAMN AND N) OR NEXT_ADDRESS[8]
        const highBit = (jamz & z) | (jamn & n) | parseInt(this.addr8);
        
        return highBit.toString();
    }

    clear() {
        this.flagZ = "0";
        this.flagN = "0"; 
        this.mir = "00";
    }
}

export default Jump;