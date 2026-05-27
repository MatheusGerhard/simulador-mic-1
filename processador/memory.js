// Main Memory - Memória Principal (RAM)

// Descrição: Armazena o programa (instruções) e os dados que serão processados.
// Recebe: os arrays do compilador e, em caso de escrita, um dado do MDR. 
// Envia: O dado ou instrução presente no endereço solicitado para o MDR.


class Memory {
    constructor(size = 4096) {
        this.data = new Array(size).fill("0000000000000000");
    }

    read(address) {
        // Proteção física: garante que o endereço de busca esteja dentro dos 12 bits
        const enderecoValido = address & 0x0FFF;
        return this.data[enderecoValido];
    }

    write(address, value) {
        const enderecoValido = address & 0x0FFF;
        this.data[enderecoValido] = value;
    }

    preencheInstrucoes(microinstrucoes, macroinstrucoes) {
        for (let i = 0; i < macroinstrucoes.length; i++) {
            this.write(macroinstrucoes[i].rotulo_index, microinstrucoes[i]);
        }
    }
}

const memoria = new Memory();

export default memoria;