// Main Memory - Memória Principal (RAM)

// Descrição: Armazena o programa (instruções) e os dados que serão processados.
// Recebe: os arrays do compilador e, em caso de escrita, um dado do MDR. 
// Envia: O dado ou instrução presente no endereço solicitado para o MDR.


class Memory {
    constructor(size = 4096) {
        this.data = new Array(size).fill("00000000000000000000000000000000");
    }

    // Recebe dado e coloca no endereço
    write(address, value) {
        this.data[address] = value;
    }

    // Envia dado do dado do endereço informado
    read(address) {
        return this.data[address];
    }
}

export default Memory;