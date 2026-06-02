// Microsequencer Logic

// Descrição: Indica os saltos no código.

class MSL {
    constructor() {
        this.value = 0;
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
    calcula() {
        if (this.cond != "00") {
            if (this.flagZ || this.flagN) {
                this.value = 1;
            }
            else if(this.cond == "11") {
                this.value = 1;                
            }
        }
    }

    // Envia para MMUX
    read() {
        return this.value;
    }


    clear() {
        this.flagZ = 0;
        this.flagN = 0;
        this.cond = "00";
    }
}

export default MSL;