import memoria from "../../mac1/componentes/memory.js";
import { logCacheHit, logCacheMiss } from "../../src/services/simulationLog.js";

const WORD_OFFSET_BITS = 2;
const WORDS_PER_BLOCK = 2 ** WORD_OFFSET_BITS;
const ADDRESS_BITS = 16;

function normalizeAddress(address) {
    if (typeof address === "number") {
        return address.toString(2).padStart(ADDRESS_BITS, "0").slice(-ADDRESS_BITS);
    }

    const value = String(address ?? "0");

    if (/^[01]+$/.test(value)) {
        return value.padStart(ADDRESS_BITS, "0").slice(-ADDRESS_BITS);
    }

    return Number.parseInt(value, 10)
        .toString(2)
        .padStart(ADDRESS_BITS, "0")
        .slice(-ADDRESS_BITS);
}

function splitAddress(address) {
    const normalizedAddress = normalizeAddress(address);

    return {
        normalizedAddress,
        tag: normalizedAddress.slice(0, -WORD_OFFSET_BITS),
        word: Number.parseInt(normalizedAddress.slice(-WORD_OFFSET_BITS), 2),
    };
}

function blockAddress(tag, word) {
    return `${tag}${word.toString(2).padStart(WORD_OFFSET_BITS, "0")}`;
}

class Cache {
    constructor(size = 3) {
        const numericSize = Number.parseInt(size, 10);
        this.size = Number.isFinite(numericSize) && numericSize >= 1 ? numericSize : 3;
        this.vbit = new Array(this.size).fill(0);
        this.tag = new Array(this.size).fill("0".repeat(ADDRESS_BITS - WORD_OFFSET_BITS));
        this.bloc = Array.from(
            { length: this.size },
            () => new Array(WORDS_PER_BLOCK).fill("0000000000000000"),
        );
        this.p = 0;
        this.ram = memoria;
    }

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
            const address = valid ? Number.parseInt(blockAddress(this.tag[index], 0), 2) : null;

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

    fillLine(pos, tag) {
        this.tag[pos] = tag;
        this.vbit[pos] = 1;

        for (let i = 0; i < WORDS_PER_BLOCK; i++) {
            this.bloc[pos][i] = this.ram.read(blockAddress(tag, i));
        }
    }

    write(address, value) {
        const { normalizedAddress, tag, word } = splitAddress(address);
        let pos = this.check(tag);

        if (pos != null) {
            logCacheHit(normalizedAddress);
        } else {
            logCacheMiss(normalizedAddress);
            pos = this.p;
            this.fillLine(pos, tag);
            this.p = (this.p + 1) % this.size;
        }

        this.bloc[pos][word] = value;
        this.ram.write(normalizedAddress, value);
    }

    read(address) {
        const { normalizedAddress, tag, word } = splitAddress(address);
        const pos = this.check(tag);

        if (pos != null) {
            logCacheHit(normalizedAddress);
            return this.bloc[pos][word];
        }

        logCacheMiss(normalizedAddress);
        this.fillLine(this.p, tag);
        this.p = (this.p + 1) % this.size;

        return null;
    }
}

export default Cache;
