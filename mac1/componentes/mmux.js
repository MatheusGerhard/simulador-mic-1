// Mmux - Multiplexador de Microprograma

// Descrição: Recebe o dado do mpc e addr, e envia o correto ao mpc 

class Mmux {
    constructor() {
        this.value = "0000000000000000";
        this.incrementedAddr = "0000000000000000";
        this.mirAddr = "0000000000000000";
        this.mslSignal = "0";
    }

    // Recebe do Increment, MSL e MIR
    write(incrementedAddr, mirAddr, mslSignal) {
        this.incrementedAddr = incrementedAddr.toString(2).padStart(16, "0");
        this.mirAddr = mirAddr;
        this.mslSignal = mslSignal;
    }

    // Seleciona o correto
    select() {
        if (this.mslSignal == 1) {
            this.value = this.mirAddr;
        }
        else {
            this.value = this.incrementedAddr;
        }
    }

    // Envia para o MPC
    read() {
        return this.value;
    }
}

export default Mmux;
