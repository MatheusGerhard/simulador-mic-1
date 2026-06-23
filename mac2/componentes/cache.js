// Cache

// Descrição: Componente que guarda dados próximo ao processador.
// Recebe: os arrays da Memória Principal e, em caso de escrita, um dado do MDR. 
// Envia: O dado ou instrução presente no endereço solicitado para o MDR.

import memoria from "../../mac1/componentes/memory.js";
import { logCacheHit, logCacheMiss } from "../../src/services/simulationLog.js";

class Cache {
    constructor(size = 3) {
        const numericSize = Number.parseInt(size, 10);
        this.size = Number.isFinite(numericSize) && numericSize >= 1 ? numericSize : 3;
        this.vbit = new Array(this.size).fill(0);
        this.tag = new Array(this.size).fill("0000000000"); // 1 bloco = 4 palavras
        this.bloc = Array.from({length: this.size}, () => new Array(4).fill("0000000000000000"));
        this.p = 0;
        this.ram = memoria;
    }

    // Verifica se o dado do endereço solicitado está presente na cache
    check(tag) {
        for (let i = 0; i < this.size; i++) {
            if (this.tag[i] == tag && this.vbit[i] == 1) {
                return i;
            }
        }
        return null;
    }

    getSnapshot() {
        return this.bloc.map((values, index) => {
            const valid = this.vbit[index] == 1;
            const address = valid ? Number.parseInt(`${this.tag[index]}00`, 2) : null;

            return {
                index,
                valid,
                tag: valid ? this.tag[index] : null,
                address,
                addressRange: valid ? `${address}-${address + values.length - 1}` : null,
                value: valid ? values.join(" | ") : null,
                values: valid ? [...values] : [],
            };
        });
    }

    // Recebe endereço e dado do MBR para RAM
    write (address, value) {
        const tag = address.slice(0, 10);
        const word = parseInt(address.slice(10, 12), 2);
        const pos = this.check(address.slice(0, 10));

        if (pos != null) {
            logCacheHit(address);
            this.bloc[pos][word] = value;
            console.log("bloco ja presente: pos("+pos+"), tag("+tag+") e word("+word+")");
        }
        else {
            logCacheMiss(address);
            this.tag[this.p] = tag;
            this.bloc[this.p][word] = value;
            this.vbit[this.p] = 0;
            console.log("bloco não presente: pos("+this.p+"), tag("+tag+") e word("+word+")");
        }

        this.ram.write(address, value);

        return;
    }

    // Envia dado do dado do endereço informado
    read(address) {
        const tag = address.slice(0, 10);
        const word = parseInt(address.slice(10, 12), 2);        
        const pos = this.check(tag);
        let data;

        // cache hit
        if (pos != null) {
            logCacheHit(address);
            data = this.bloc[pos][word]
            console.log("bloco presente: pos("+pos+"), tag("+tag+") e word("+word+")");
        }
        // cache miss
        else {
            logCacheMiss(address);
            const bloco = [tag+"00", tag+"01", tag+"10", tag+"11"]
            // console.log(bloco[])
            this.tag[this.p] = tag;
            this.vbit[this.p] = 1;

            console.log("bloco adicionado: pos("+this.p+"), tag("+tag+") e word("+word+")");
            for (let i = 0; i < 4; i++) {
                this.bloc[this.p][i] = this.ram.read(bloco[i]);
                console.log(this.bloc[this.p][i]);
            }

            this.p = (this.p + 1) % this.size;
            
            data = null;
        }

        return data;
    }
}

export default Cache;
