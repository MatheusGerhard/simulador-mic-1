import detecta_tipo_instrucao from "./macroinstrucoes.js";

class Montador{
    
    microinstrucoes = [];
    

    constructor(assemblyCode){
        this.assemblyCode = assemblyCode;;
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
        let index_fim = linha.indexOf(";"); //Remove comentários
        linha = linha.substring(0, index_fim);

        linha = linha.split(" ").filter(token => token.length > 0); //Remove espaços extras e divide a linha em tokens
        let rotulo = null;
        let rotulo_index = linha_num;
        let opcode = null;
        let operando = null;
        let error = null;

        


        // Começa a tokenização
        if (linha.length === 2) {
            // significa que a linha tem um opcode e um operando ou um rótulo e um operando
            if(linha[0].endsWith(":")) {
                // significa que a linha tem um rótulo e um operando
                linha[0] = linha[0].replace(":", ""); //Remove os dois pontos do rótulo
                rotulo = linha[0];
                rotulo_index = linha[1];
                if(isNaN(parseInt(rotulo_index))){
                    //Se o operando não for um número, deixa o operando como string, pois pode ser um rótulo que será resolvido na primeira passagem
                }else{
                    rotulo_index = parseInt(rotulo_index); //Tenta converter o operando para um número, se for possível
                }
            }else{
                // significa que a linha tem um opcode e um operando
                opcode = linha[0];
                operando = linha[1];
                if(isNaN(parseInt(operando))){
                    //Se o operando não for um número, deixa o operando como string, pois pode ser um rótulo que será resolvido na primeira passagem
                }else{
                    operando = parseInt(operando); //Tenta converter o operando para um número, se for possível
                }


            }

        }else if (linha.length === 3) {
            // significa que a linha tem um rótulo, um opcode e um operando
            linha[0] = linha[0].replace(":", ""); //Remove os dois pontos do rótulo
            rotulo = linha[0];
            opcode = linha[1];
            operando = linha[2];
            if(isNaN(parseInt(operando))){
                //Se o operando não for um número, deixa o operando como string, pois pode ser um rótulo que será resolvido na primeira passagem
            }else{
                operando = parseInt(operando); //Tenta converter o operando para um número, se for possível
            }
        }else{
            return { rotulo,rotulo_index, opcode, operando, error: 1 };
        }

        return { rotulo,rotulo_index, opcode, operando, error: null };
    }

    tokeniza_codigo(){
        let macroinstrucoes = [];
        let linha_num = 0;
        for (let linha of this.assemblyCode) {
            if(this.tokeniza_linha(linha, linha_num).error === 1){
                return { error: "Erro na linha: " + linha };
            }
            macroinstrucoes.push(this.tokeniza_linha(linha, linha_num));
            linha_num++;
            
        }
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

    main(){
        //Realiza as tres operações do montador e preenche o atributo microinstrucoes com o código de máquina correspondente ao código assembly recebido no construtor
        let macroinstrucoes = montador.tokeniza_codigo();
        if(macroinstrucoes.error){
            console.error(macroinstrucoes.error);
            return null;
        }

        montador.primeira_passagem(macroinstrucoes);

        montador.segunda_passagem(macroinstrucoes);
    }
}

let string = `LOCO 10;\nSTOD 100;\nLOCO 20;\nADDD 100;\nSTOD 101;
`

let montador = new Montador(string);


montador.main();

console.log(montador.microinstrucoes);
