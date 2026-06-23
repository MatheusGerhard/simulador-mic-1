import detecta_tipo_instrucao from "./macroinstrucoes.js";
import memoria from "../mac1/componentes/memory.js";
import { registerMacroInstructions } from "../src/services/simulationLog.js";

class Montador{
    
    microinstrucoes = [];
    macroinstrucoes = [];
    

    constructor(assemblyCode){
        this.assemblyCode = assemblyCode;
        this.assemblyCode = this.stringify(); //Transforma o código em um array de linhas, removendo espaços e linhas vazias. Cada elemento é uma instrução :( .        
        
    }

    stringify(){
        this.assemblyCode = this.assemblyCode.toUpperCase(); //Transforma tudo em maiúsculo para facilitar a tokenização
        this.assemblyCode = this.assemblyCode.split("\n").map(line => line.trim()).filter(line => line.length > 0);

        return this.assemblyCode;
    }


    // Recebe uma linha de código assembly (string) e retorna um dicionário com os valores de cada token da linha, por exemplo:
    // "LODD 100" -> { opcode: "LODD", operand: "100" }
    tokeniza_linha(linha, linha_num){
    let index_fim = linha.indexOf(";");
    if (index_fim !== -1) linha = linha.substring(0, index_fim);

    linha = linha.split(" ").filter(token => token.length > 0);
    let rotulo = null;
    let rotulo_index = linha_num;
    let opcode = null;
    let operando = null;
    let error = null;

    const INSTRUCOES_SEM_OPERANDO = new Set([
        "PSHI", "POPI", "PUSH", "POP", "RETN", "SWAP"
    ]);

    const INSTRUCOES_12BITS = new Set([
        "LODD", "STOD", "ADDD", "SUBD",
        "JPOS", "JZER", "JUMP", "LOCO",
        "LODL", "STOL", "ADDL", "SUBL",
        "JNEG", "JNZE", "CALL"
    ]);

    const INSTRUCOES_8BITS = new Set(["INSP", "DESP"]);

    const valida_opcode = (opcode, operando) => {
        if (INSTRUCOES_SEM_OPERANDO.has(opcode)) {
            // Não deve ter operando
            if (operando !== null) return false;
        } else if (INSTRUCOES_12BITS.has(opcode)) {
            // Operando numérico deve estar entre 0 e 4095
            if (typeof operando === "number" && (operando < 0 || operando > 4095)) return false;
            // Deve ter operando
            if (operando === null) return false;
        } else if (INSTRUCOES_8BITS.has(opcode)) {
            // Operando numérico deve estar entre 0 e 255
            if (typeof operando === "number" && (operando < 0 || operando > 255)) return false;
            // Deve ter operando
            if (operando === null) return false;
        } else {
            // Opcode não reconhecido
            return false;
        }
        return true;
    };

    if (linha.length === 2) {
        if (linha[0].endsWith(":")) {
            linha[0] = linha[0].replace(":", "");
            rotulo = linha[0];
            rotulo_index = linha[1];
            if (isNaN(parseInt(rotulo_index))) {
                // Rótulo a resolver
            } else {
                rotulo_index = parseInt(rotulo_index);
            }
        } else {
            opcode = linha[0];
            operando = linha[1];
            if (isNaN(parseInt(operando))) {
                // Operando como string (rótulo a resolver)
            } else {
                operando = parseInt(operando);
            }
            if (!valida_opcode(opcode, operando)) {
                return { rotulo, rotulo_index, opcode, operando, error: 1 };
            }
        }

    } else if (linha.length === 3) {
        linha[0] = linha[0].replace(":", "");
        rotulo = linha[0];
        opcode = linha[1];
        operando = linha[2];
        if (isNaN(parseInt(operando))) {
            // Operando como string (rótulo a resolver)
        } else {
            operando = parseInt(operando);
        }
        if (!valida_opcode(opcode, operando)) {
            return { rotulo, rotulo_index, opcode, operando, error: 1 };
        }

    } else if (linha.length === 1) {
        opcode = linha[0];
        if (!valida_opcode(opcode, null)) {
            return { rotulo, rotulo_index, opcode, operando, error: 1 };
        }
    } else {
        return { rotulo, rotulo_index, opcode, operando, error: 1 };
    }

    return { rotulo, rotulo_index, opcode, operando, error: null };
    }

    tokeniza_codigo(){
    let macroinstrucoes = [];
    let linha_num = 0;
    for (let linha of this.assemblyCode) {
        let resultado = this.tokeniza_linha(linha, linha_num); // Chama apenas UMA vez

        if(resultado.error === 1){
            return { error: "Erro na linha " + linha_num + ": " + linha };
        }

        macroinstrucoes.push(resultado);

        // Só incrementa o endereço se a linha tiver uma instrução real
        if(resultado.opcode !== null){
            linha_num++;
        }
    }
    this.macroinstrucoes = macroinstrucoes;
    return macroinstrucoes;
    }

    primeira_passagem(macroinstrucoes){
        //transformando o operando de rótulo para número, caso o operando seja um rótulo, por exemplo:
        // "inicio: LODD 100" -> { rotulo: "inicio", opcode: "LODD", operando: "100" }
        // "LODD inicio" -> { opcode: "LODD", operando: "inicio" }

        //realiza n^2 vezes para garantir que todos os rótulos sejam resolvidos, mesmo aqueles que são definidos depois de serem usados
        for (let j = 0; j < macroinstrucoes.length; j++){
            for (let i = 0; i < macroinstrucoes.length; i++) {
                let instrucao = macroinstrucoes[i];
                if(typeof(instrucao.operando) === "string"){
                    //Se o operando for uma string, significa que é um rótulo, então precisamos encontrar o endereço do rótulo e substituir o operando pelo endereço do rótulo
                    let rotulo = macroinstrucoes.find(instrucaoalvo => instrucaoalvo.rotulo === instrucao.operando);
                    if(rotulo){
                        instrucao.operando = rotulo.rotulo_index; //Substitui o operando pelo endereço do rótulo
                    }else{
                        return { error: "Rótulo não encontrado: " + instrucao.operando };
                    }
                }
                if(typeof(instrucao.rotulo_index) === "string"){
                    //Se o operando for uma string, significa que é um rótulo, então precisamos encontrar o endereço do rótulo e substituir o operando pelo endereço do rótulo
                    let rotulo = macroinstrucoes.find(instrucaoalvo => instrucaoalvo.rotulo === instrucao.rotulo_index);
                    if(rotulo){
                        instrucao.rotulo_index = rotulo.rotulo_index; //Substitui o operando pelo endereço do rótulo
                    }else{
                        return { error: "Rótulo não encontrado: " + instrucao.rotulo_index };
                    }
                }
            }
        }
        return macroinstrucoes;
    }
    segunda_passagem(macroinstrucoes){
        //transforma as instruções em código de máquina, por exemplo:
        // { opcode: "LODD", operando: 100 } -> "0000 0000 0110 0100"
        for (let instrucao of macroinstrucoes) {
            let instrucaobin = detecta_tipo_instrucao(instrucao);
            if(instrucaobin === null){
                return null;
            }
            this.microinstrucoes.push(instrucaobin);
        }
        return true;
    }

    preencherMemoria(){
        registerMacroInstructions(this.macroinstrucoes);
        memoria.preencheInstrucoes(this.microinstrucoes, this.macroinstrucoes);
    }

    main(){
    let macroinstrucoes = this.tokeniza_codigo();
    if(macroinstrucoes.error){
        console.error(macroinstrucoes.error);
        return macroinstrucoes.error;
    }

    let resultado_passagem1 = this.primeira_passagem(macroinstrucoes);
    if(resultado_passagem1.error){
        console.error(resultado_passagem1.error);
        return null;
    }

    let resultado_passagem2 = this.segunda_passagem(macroinstrucoes);
    if(resultado_passagem2 === null){        // <-- estava ignorado antes
        console.error("Erro na segunda passagem");
        return null;
    }

    return false; // Indica que a montagem foi bem-sucedida
    console.log(this.microinstrucoes);
    console.log(this.macroinstrucoes);
    }
}


let string = `LOCO 10;\nSTOD 100;\nLOCO 20;\nADDD 100;\nSTOD 101;`



export default Montador;
