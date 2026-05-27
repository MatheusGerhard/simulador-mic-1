// Main Memory - Memória Principal

// Descrição: Armazena o programa (instruções) e os dados que serão processados.
// Recebe: os arrays do compilador e, em caso de escrita, um dado do MDR. 
// Envia: O dado ou instrução presente no endereço solicitado para o MDR.


class Memory {
    constructor(size = 4096) {
        this.data = new Array(size).fill("0000000000000000");
    }

    read(address) {
        return this.data[address];
    }

    write(address, value) {
        this.data[address] = value;
    }

    preencheInstrucoes(microinstrucoes, macroinstrucoes) {
        for (let i = 0; i < macroinstrucoes.length; i++) {
            this.write(macroinstrucoes[i].rotulo_index, microinstrucoes[i]);
            console.log(microinstrucoes);
            console.log(microinstrucoes[i]);
        }
    }
}

const memoria = new Memory();

export default memoria;