// Microsequencer Logic

// Descrição: Indica os saltos no código.

class MSL {
    constructor() {
        this.flagZ = 0;
        this.flagN = 0; 
    }

    // Recebe valores da ALU
    write(z, n) {
        this.flagZ = z;
        this.flagN = n;
    }

    // Calcula o próximo endereço baseado nos bits JAM e no endereço base
    proximoEndereco(mir) {
        let addr = mir.nextAddress || 0;
        
        if ((mir.jamz && this.flagZ) || (mir.jamn && this.flagN)) {
            addr = mir.jumpAddress;
        }
        
        return addr;
    }

    clear() {
        this.flagZ = 0;
        this.flagN = 0; 
    }
}

export default MSL;