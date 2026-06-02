// ─────────────────────────────────────────────
// Instruções com operando de 12 bits (endereço)
// ─────────────────────────────────────────────

function lodd(linha) {
    if (linha.opcode === "LODD") {
        if (linha.operando > 4095) {
            console.error("Valor do operando é muito grande para ser representado em 12 bits");
            return null;
        }
        let operando = linha.operando.toString(2).padStart(12, '0');
        return "0000" + operando;
    }
    return null;
}

function stod(linha) {
    if (linha.opcode === "STOD") {
        if (linha.operando > 4095) {
            console.error("Valor do operando é muito grande para ser representado em 12 bits");
            return null;
        }
        let operando = linha.operando.toString(2).padStart(12, '0');
        return "0001" + operando;
    }
    return null;
}

function addd(linha) {
    if (linha.opcode === "ADDD") {
        if (linha.operando > 4095) {
            console.error("Valor do operando é muito grande para ser representado em 12 bits");
            return null;
        }
        let operando = linha.operando.toString(2).padStart(12, '0');
        return "0010" + operando;
    }
    return null;
}

function subd(linha) {
    if (linha.opcode === "SUBD") {
        if (linha.operando > 4095) {
            console.error("Valor do operando é muito grande para ser representado em 12 bits");
            return null;
        }
        let operando = linha.operando.toString(2).padStart(12, '0');
        return "0011" + operando;
    }
    return null;
}

function jpos(linha) {
    if (linha.opcode === "JPOS") {
        if (linha.operando > 4095) {
            console.error("Valor do operando é muito grande para ser representado em 12 bits");
            return null;
        }
        let operando = linha.operando.toString(2).padStart(12, '0');
        return "0100" + operando;
    }
    return null;
}

function jzer(linha) {
    if (linha.opcode === "JZER") {
        if (linha.operando > 4095) {
            console.error("Valor do operando é muito grande para ser representado em 12 bits");
            return null;
        }
        let operando = linha.operando.toString(2).padStart(12, '0');
        return "0101" + operando;
    }
    return null;
}

function jump(linha) {
    if (linha.opcode === "JUMP") {
        if (linha.operando > 4095) {
            console.error("Valor do operando é muito grande para ser representado em 12 bits");
            return null;
        }
        let operando = linha.operando.toString(2).padStart(12, '0');
        return "0110" + operando;
    }
    return null;
}

function loco(linha) {
    if (linha.opcode === "LOCO") {
        if (linha.operando > 4095) {
            console.error("Valor do operando é muito grande para ser representado em 12 bits");
            return null;
        }
        let operando = linha.operando.toString(2).padStart(12, '0');
        return "0111" + operando;
    }
    return null;
}

function lodl(linha) {
    if (linha.opcode === "LODL") {
        if (linha.operando > 4095) {
            console.error("Valor do operando é muito grande para ser representado em 12 bits");
            return null;
        }
        let operando = linha.operando.toString(2).padStart(12, '0');
        return "1000" + operando;
    }
    return null;
}

function stol(linha) {
    if (linha.opcode === "STOL") {
        if (linha.operando > 4095) {
            console.error("Valor do operando é muito grande para ser representado em 12 bits");
            return null;
        }
        let operando = linha.operando.toString(2).padStart(12, '0');
        return "1001" + operando;
    }
    return null;
}

function addl(linha) {
    if (linha.opcode === "ADDL") {
        if (linha.operando > 4095) {
            console.error("Valor do operando é muito grande para ser representado em 12 bits");
            return null;
        }
        let operando = linha.operando.toString(2).padStart(12, '0');
        return "1010" + operando;
    }
    return null;
}

function subl(linha) {
    if (linha.opcode === "SUBL") {
        if (linha.operando > 4095) {
            console.error("Valor do operando é muito grande para ser representado em 12 bits");
            return null;
        }
        let operando = linha.operando.toString(2).padStart(12, '0');
        return "1011" + operando;
    }
    return null;
}

function jneg(linha) {
    if (linha.opcode === "JNEG") {
        if (linha.operando > 4095) {
            console.error("Valor do operando é muito grande para ser representado em 12 bits");
            return null;
        }
        let operando = linha.operando.toString(2).padStart(12, '0');
        return "1100" + operando;
    }
    return null;
}

function jnze(linha) {
    if (linha.opcode === "JNZE") {
        if (linha.operando > 4095) {
            console.error("Valor do operando é muito grande para ser representado em 12 bits");
            return null;
        }
        let operando = linha.operando.toString(2).padStart(12, '0');
        return "1101" + operando;
    }
    return null;
}

function call(linha) {
    if (linha.opcode === "CALL") {
        if (linha.operando > 4095) {
            console.error("Valor do operando é muito grande para ser representado em 12 bits");
            return null;
        }
        let operando = linha.operando.toString(2).padStart(12, '0');
        return "1110" + operando;
    }
    return null;
}

// ─────────────────────────────────────────────
// Instruções sem operando (16 bits fixos)
// ─────────────────────────────────────────────

function pshi(linha) {
    if (linha.opcode === "PSHI") {
        return "1111000000000000";
    }
    return null;
}

function popi(linha) {
    if (linha.opcode === "POPI") {
        return "1111001000000000";
    }
    return null;
}

function push(linha) {
    if (linha.opcode === "PUSH") {
        return "1111010000000000";
    }
    return null;
}

function pop(linha) {
    if (linha.opcode === "POP") {
        return "1111011000000000";
    }
    return null;
}

function retn(linha) {
    if (linha.opcode === "RETN") {
        return "1111100000000000";
    }
    return null;
}

function swap(linha) {
    if (linha.opcode === "SWAP") {
        return "1111101000000000";
    }
    return null;
}

// ─────────────────────────────────────────────
// Instruções com operando de 8 bits (y)
// ─────────────────────────────────────────────

function insp(linha) {
    if (linha.opcode === "INSP") {
        if (linha.operando > 255) {
            console.error("Valor do operando é muito grande para ser representado em 8 bits");
            return null;
        }
        let operando = linha.operando.toString(2).padStart(8, '0');
        return "11111100" + operando;
    }
    return null;
}

function desp(linha) {
    if (linha.opcode === "DESP") {
        if (linha.operando > 255) {
            console.error("Valor do operando é muito grande para ser representado em 8 bits");
            return null;
        }
        let operando = linha.operando.toString(2).padStart(8, '0');
        return "11111110" + operando;
    }
    return null;
}

function detecta_tipo_instrucao(linha){
    let instrucaobin = lodd(linha) || stod(linha) || addd(linha) || subd(linha) || jpos(linha) || jzer(linha) || jump(linha) || loco(linha) || lodl(linha) || stol(linha) || addl(linha) || subl(linha) || jneg(linha) || jnze(linha) || call(linha) || pshi(linha) || popi(linha) || push(linha) || pop(linha) || retn(linha) || swap(linha) || insp(linha) || desp(linha);
    
    if(instrucaobin === null){
        console.log("Label")
        return "0000000000000000";
    }
    
    return instrucaobin;
}

export default detecta_tipo_instrucao;