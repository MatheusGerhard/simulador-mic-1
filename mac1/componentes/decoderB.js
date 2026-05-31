// Decoder B

// Descrição: Decodifica o campo de seleção do Barramento A para identificar qual registrador enviará seu valor para a entrada esquerda da ULA.

class DecoderB {
    constructor() {
        this.data = "0000";
    }

    // Recebe o sinal binário vindo do MIR 
    write(newValue) {
        this.data = newValue;
    }

    // Mapeia o valor binário para o nome da propriedade na classe Registers
    read() {
        let value = parseInt(this.data, 2);
        switch (value) {
            case 1:
                return "pc";
            case 2:
                return "ac";
            case 3:
                return "sp";
            case 4:
                return "ir"; // Utilizado para LOCO e saltos (amask)
            case 5:
                return "ir";
            case 6:
                return "tir";
            case 7:
                return "mbr";
            default:
                return "none";
        }
    }
}

export default DecoderB;