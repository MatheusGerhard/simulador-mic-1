// Decoder C

// Descrição: Indica qual registrador vai receber o resultado do Shifter

class DecoderC {
    constructor() {
        this.data = "0000";
    }

    // Recebe o sinal binário vindo do MIR 
    write(newValue) {
        this.data = newValue;
    }

    // Mapeia o valor e envia para os Registradores
    read() {
        return parseInt(this.data, 2);
    }
}

export default DecoderC;