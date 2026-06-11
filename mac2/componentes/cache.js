// Cache

// Descrição: Componente que guarda dados próximo ao processador.
// Recebe: os arrays da Memória Principal e, em caso de escrita, um dado do MDR. 
// Envia: O dado ou instrução presente no endereço solicitado para o MDR.


class Cache {
    constructor(size = 4) {
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

export default Cache;