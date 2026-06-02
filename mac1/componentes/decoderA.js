// Decoder A

// Descrição: Decodifica o campo de seleção do Barramento A para identificar qual registrador enviará seu valor para a entrada esquerda da ULA.

class DecoderA {
    constructor() {
        this.data = "0000";
    }

    // Recebe o sinal binário vindo do MIR 
    write(newValue) {
        this.data = newValue;
    }

    // Mapeia o valor e envia para A latch
    read() {
        return this.data;
    }
}

export default DecoderA;