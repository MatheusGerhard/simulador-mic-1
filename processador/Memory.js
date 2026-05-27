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