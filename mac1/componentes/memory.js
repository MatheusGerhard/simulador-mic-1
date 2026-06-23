// Main Memory - Memória Principal (RAM)

// Descrição: Armazena o programa (instruções) e os dados que serão processados.
// Recebe: os arrays do compilador e, em caso de escrita, um dado do MDR. 
// Envia: O dado ou instrução presente no endereço solicitado para o MDR.


import { clearMacroInstructionCatalog, logMemoryWrite } from "../../src/services/simulationLog.js";

export class Memory {
    constructor(size = 4096) {
        this.data = new Array(size).fill("0000000000000000");
    }

    read(address) {
        address = parseInt(address,2);
        return this.data[address];
    }

    write(address, value) {
        address = parseInt(address,2);
        const previousValue = this.data[address];
        this.data[address] = value;
        logMemoryWrite(address, previousValue, value);
        console.log(`RAM: Escreveu ${value} no endereço ${address}`);
    }
    writeMontador(address, value) {
        const previousValue = this.data[address];
        this.data[address] = value;
        logMemoryWrite(address, previousValue, value);
        console.log(`RAM: Escreveu ${value} no endereço ${address}`);
    }
    clearMemory(){
        this.data = new Array(this.data.length).fill("0000000000000000");
        clearMacroInstructionCatalog();
    }

    preencheInstrucoes(microinstrucoes, macroinstrucoes) {
        for (let i = 0; i < macroinstrucoes.length; i++) {
            if(macroinstrucoes[i].rotulo !=null && macroinstrucoes[i].opcode === null) break;
            this.writeMontador(macroinstrucoes[i].rotulo_index, microinstrucoes[i]);
        }
    }
}

const memoria = new Memory();

export default memoria;