// DecoderI - Decodificardor de Instrução

// Descrição: Recebe o dado do IR e faz o mpc apontar para os dados certos.

class DecoderI {
    constructor() {
        this.instrucao = "0000000000000000"
        this.value = "000000";
    }

    // Recebe do MBR
    write(value) {
        this.instrucao = value;
        // console.log(this.instrucao);
    }

    // Decodifica a macroinstrução
    decode() {
        const opcode = parseInt(this.instrucao.slice(0, 4), 2);
        if (opcode === 15) {
            opcode += parseInt(this.instrucao.slice(4, 8), 2);
        } 
        this.value = opcode.toString(2).padStart(6, '0');        
        // console.log(this.value);
    }

    // Envia para o MPC
    read() {
        return this.value;
    }
}

export default DecoderI;