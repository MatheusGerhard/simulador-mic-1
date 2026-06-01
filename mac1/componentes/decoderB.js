// Decoder B

// Descrição: Decodifica o campo de seleção do Barramento B para identificar qual registrador enviará seu valor para a entrada esquerda da ULA.

class DecoderB {
    constructor() {
        this.data = "0000";
    }

    // Recebe o sinal binário vindo do MIR 
    write(newValue) {
        this.data = newValue;
    }

    // Mapeia o valor e envia para B latch
    read() {
        return parseInt(this.data, 2);
    }
}

export default DecoderB;