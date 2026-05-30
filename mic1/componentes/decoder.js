// Decoder - Decodificador 4 para 16

// Descrição: recebe 4 bits do MIR e aciona o registrador correto.


class Decoder {
    constructor() {
        this.data = "";
    }

    // Recebe a instrução do MIR
    write (newValue) {
        this.data = newValue;
    }

    // Indica o Registtrador correto.
    read(regName) {
        let value = parseInt(this.data, 2);
        switch (value) {
            case 0:
                return "mdr";
            case 1:
                return "pc";
            case 2:
                return "mbr";
            case 3:
                return "mbru";
            case 4:
                return "sp";
            case 5:
                return "lv";
            case 6:
                return "cpp";
            case 7:
                return "tos";
            case 8:
                return "opc";
            default:
                return "none";
        }
    }
}

export default Decoder;