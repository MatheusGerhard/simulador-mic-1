// Cache

// Descrição: Componente que guarda dados próximo ao processador.
// Recebe: os arrays da Memória Principal e, em caso de escrita, um dado do MDR. 
// Envia: O dado ou instrução presente no endereço solicitado para o MDR.

import memoria from "../../mac1/componentes/memory.js";

class Cache {
    constructor(size = 4) {
        this.data = new Array(size).fill("00000000000000000000000000000000");
        this.ram = memoria;
    }

    // Recebe dado e coloca no endereço
    write(address, value) {
        this.ram.write(address, value)
    }

    // Envia dado do dado do endereço informado
    read(address) {
        return this.ram.read(address);
    }
}

export default Cache;