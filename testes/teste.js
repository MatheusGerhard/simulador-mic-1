// importações
import ControlUnit1 from '../mac1/controlUnit.js';
import ControlUnit2 from '../mac2/controlUnit.js';
import Clock from '../mac1/componentes/clock.js';
import memoria from "../mac1/componentes/memory.js";
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

const PROGRAMAS = {
    1: {
        nome: "ARITMETICA DIRETA",
        fimPC: 7, // O teste termina após executar a 7ª instrução (índice 6)
        instrucoes: [
            "0111000000000101", // LOCO  5; AC = 5
            "0001000000001010", // STOD 10; Salva 5 no endereço 10
            "0111000000000011", // LOCO  3; AC = 3
            "0001000000001011", // STOD 11; Salva 3 no endereço 11
            "0000000000001010", // LODD 10; AC = valor do endereço 10
            "0010000000001011", // ADDD 11; AC += valor do endereço 11
            "0011000000001011"  // SUBD 11; AC -= valor do endereço 11
        ]
    },
    2: {
        nome: "SALTOS",
        fimPC: 15,
        instrucoes: [
            "0100000000000010", // JUMP  2; Pula para o 2
            "0111000000000001", // LOCO  1; (Não executa)
            "0101000000000100", // JZER  4; Se for zero, pula para o 4
            "0111000000000001", // LOCO  1; (Não executa)
            "0111000000001010", // LOCO 10; AC = 10
            "0110000000000111", // JPOS  7; Se for positivo, pula para o endereço 7
            "0111000000000001", // LOCO  1; (Não executa)
            "0001000000010100", // STOD 20; Salva 10 no endereço 20
            "0111000000001001", // LOCO  9; AC = 9
            "0011000000010100", // SUBD 20; AC -= 9 = -1
            "0111000000001100", // JNEG 12; Se for negativo, pula para o endereço 12
            "0111000000000001", // LOCO  1; (Não executa)
            "1101000000001110", // JNZE 14; Se for diferente de zero, pula para o endereço 14
            "0111000000000001", // LOCO  1; (Não executa)
            "0111000000000011"  // LOCO  3; Endereco 14: Fim do teste
        ]
    },
    3: {
        nome: "SUB-ROTINAS",
        fimPC: 8,
        instrucoes: [
            "1110000000000100", // CALL  4; Pula para a sub-rotina e salva retorno
            "0111000000000000", // LOCO  0; AC = 0 (limpa AC)
            "0000000000001111", // LODD 15; Se voltar corretamente, carrega resultado
            "0100000000000111", // JUMP  7; Pula para o final
            "0111000000001010", // LOCO 10; (Sub-rotina) AC = 10
            "0001000000001111", // STOD 15; Salva 10 no endereço 15
            "1111000000000000", // RETN   ; Volta para logo após o CALL
            "0111000000000011"  // LOCO  3; Finaliza
        ]
    },
    4: {
        nome: "MEMÓRIA LOCAL",
        fimPC: 9,
        instrucoes: [
            "1111000000000010", // DESP 2 ; Aloca 2 espaços na pilha
            "0111000000001010", // LOCO 10; AC = 10
            "1010000000000000", // STOL 0 ; Local[0] (SP+0) = 10
            "0111000000010100", // LOCO 20; AC = 20
            "1010000000000001", // STOL 1 ; Local[1] (SP+1) = 20
            "1001000000000000", // LODL 0 ; AC = 10
            "1011000000000001", // ADDL 1 ; AC = 10 + 20 = 30
            "1100000000000000", // SUBL 0 ; AC = 30 - 10 = 20
            "1111000000000010"  // INSP 2 ; Desaloca 2 espaços
        ]
    },
    5: {
        nome: "PILHA",
        fimPC: 8,
        instrucoes: [
            "0111000000001010", // LOCO   10; Valor 10 no AC
            "1111010000000000", // PUSH     ; Empilha 10 no 4095
            "0111111111111111", // LOCO 4095; AC = 4095
            "1111000000000000", // PSHI     ; Vai no 4095, pegar o valor 10 e empilhar no 4094
            "0111111111111100", // LOCO 4092; AC = 4092
            "1111001000000000", // POPI     ; Vai até 4094, desempilha o valor 10 e coloca no 4092
            "1111011000000000", // POP      ; Desempilha (AC deve ficar 10)
            "1111101000000000", // SWAP     ; Troca o sp de 0 para 10
        ]
    }
};

async function executarPainel() {
    const rl = readline.createInterface({ input, output });
    let continuar = true;

    while (continuar) {
        console.clear();
        console.log("=== PAINEL DE TESTES DA ARQUITETURA ===");
        const macOpcao = await rl.question("Digite o modelo do mac (1 ou 2) ou 'sair': ");

        if (macOpcao.toLowerCase() === 'sair') {
            continuar = false;
            break;
        }

        console.log("\nEscolha o tipo de teste:");
        console.log("1 - ARITMETICA DIRETA");
        console.log("2 - SALTOS");
        console.log("3 - SUB-ROTINAS");
        console.log("4 - MEMÓRIA LOCAL");
        console.log("5 - PILHA");
        const testeOpcao = await rl.question("Opção: ");

        const programaSelecionado = PROGRAMAS[testeOpcao];

        if (!programaSelecionado) {
            console.log("Opção de teste inválida!");
            await rl.question("\nPressione Enter para tentar novamente...");
            continue;
        }

        // Limpa e inicializa a memória com o teste escolhido
        for (let i = 0; i < programaSelecionado.instrucoes.length; i++) {
            memoria.writeMontador(i, programaSelecionado.instrucoes[i]);
        }

        // Escolhe a Unidade de Controle correta baseado no input
        let uc = macOpcao === "1" ? new ControlUnit1() : new ControlUnit2();
        const clock = new Clock();

        console.log(`\nIniciando teste do MAC-${macOpcao} [${programaSelecionado.nome}]...`);
        clock.setVelocidade(50);

        // Usamos uma Promise para segurar o loop do painel enquanto o clock roda
        await new Promise((resolve) => {
            clock.iniciar(uc);

            uc.setCallback((estado) => {
                // Monitoramento inteligente pelo PC (Program Counter)
                // Quando o PC passa da última instrução carregada, finaliza.
                if (parseInt(estado.pc, 2) > programaSelecionado.fimPC) {
                    clock.pausar();
                    console.log("\n=================================");
                    console.log("✔ Simulação finalizada com sucesso!");
                    console.log("Valor final no AC:", estado.ac);
                    console.log(`Total de Ciclos gastos: ${estado.ciclos}`);
                    console.log("=================================\n");
                    resolve();
                }
            });
        });

        await rl.question("Pressione Enter para voltar ao menu principal...");
    }

    rl.close();
    console.log("Painel encerrado.");
}

// Dispara a execução assíncrona
executarPainel();