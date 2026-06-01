// Microsequencer Logic

// Descrição: Indica os saltos no código.

class MSL {
    constructor() {
        this.flagZ = 0;
        this.flagN = 0;
        this.cond = "00";
    }

    // Recebe valores da ALU e MIR
    write(z, n, cond) {
        this.flagZ = z;
        this.flagN = n;
        this.cond = cond;
    }

    // Calcula o próximo endereço baseado nos bits JAM e no endereço base
    read() {
        let addr = 0;
        
        if (this.flagZ ||this.flagN || this.cond != "00") {
            addr = 1;
        }
        
        return addr;
    }

    clear() {
        this.flagZ = 0;
        this.flagN = 0;
        this.cond = "00";
    }
}

export default MSL;