### MACROINSTRUÇÃO

| Binário | Mnemonic | Instrução | Significado |
| :---: | :---: | :---: | :---: |
| 0000xxxxxxxxxxxx | LODD | Load direct | ac := m[x] |
| 0001xxxxxxxxxxxx | STOD | Store direct | m[x] := ac |
| 0010xxxxxxxxxxxx | ADDD | Add direct | ac := ac + m[x] |
| 0011xxxxxxxxxxxx | SUBD | Subtract direct | ac := ac - m[x] |
| 0100xxxxxxxxxxxx | JPOS | Jump positive | if ac >= 0 then pc := x |
| 0101xxxxxxxxxxxx | JZER | Jump zero | if ac == 0 then pc := x |
| 0110xxxxxxxxxxxx | JUMP | Jump | pc := x |
| 0111xxxxxxxxxxxx | LOCO | Load constant | ac := x (0 <= x <= 4095) |
| 1000xxxxxxxxxxxx | LODL | Load local | ac := m[sp + x] |
| 1001xxxxxxxxxxxx | STOL | Store local | m[sp + x] := ac |
| 1010xxxxxxxxxxxx | ADDL | Add local | ac := ac + m[sp + x] |
| 1011xxxxxxxxxxxx | SUBL | Subtract local | ac := ac - m[sp + x] |
| 1100xxxxxxxxxxxx | JNEG | Jump negative | if ac < 0 then pc := x |
| 1101xxxxxxxxxxxx | JNZE | Jump nonzero | if ac != 0 then pc := x |
| 1110xxxxxxxxxxxx | CALL | Call procedure | sp := sp - 1; m[sp] := pc; pc := x |
| 1111000000000000 | PSHI | Push indirect | sp := sp - 1; m[sp] := m[ac] |
| 1111001000000000 | POPI | Pop indirect | m[ac] := m[sp]; sp := sp + 1 |
| 1111010000000000 | PUSH | Push onto stack | sp := sp - 1; m[sp] := ac |
| 1111011000000000 | POP | Pop from stack | ac := m[sp]; sp := sp + 1 |
| 1111100000000000 | RETN | Return | pc := m[sp]; sp := sp + 1 |
| 1111101000000000 | SWAP | Swap ac, sp | tmp := ac; ac := sp; sp := tmp |
| 11111100yyyyyyyy | INSP | Increment sp | sp := sp + y (0 <= y <= 255) |
| 11111110yyyyyyyy | DESP | Decrement sp | sp := sp - y (0 <= y <= 255) |

* `xxxxxxxxxxxx` is a 12-bit machine address (x).
* `yyyyyyyy` is an 8-bit constant (y).

---

### MICROINSTRUÇÃO

| Endereço | Microinstrução | Macro | Significado |
| :---: | :--- | :--- | :--- |
| 0 | mar:=pc; rd; | Busca | Busca da instrução |
| 1 | pc:=pc + 1; rd; | Busca | Incrementa PC |
| 2 | ir:=mbr; if n then goto 28; | Busca/Identifica | Decodificação (bit 15) |
| 3 | tir:=lshift(ir + ir); if n then goto 19; | Identifica | Decodificação (bit 14) |
| 4 | tir:=lshift(tir); if n then goto 11; | Identifica | Decodificação (bit 13) |
| 5 | alu:=tir; if n then goto 9; | Identifica | Decodificação (bit 12) |
| 6 | mar:=ir; rd; | Executa {0000 = LODD} | {0000 = LODD} Início |
| 7 | rd; | Executa | Aguarda memória |
| 8 | ac:=mbr; goto 0; | Executa | LODD Fim |
| 9 | mar:=ir; mbr:=ac; wr; | {0001 = STOD} | {0001 = STOD} Início |
| 10 | wr; goto 0; | Executa | STOD Fim |
| 11 | alu:=tir; if n then goto 15; | Identifica | Decodificação |
| 12 | mar:=ir; rd; | {0010 = ADDD} | {0010 = ADDD} Início |
| 13 | rd; | Executa | Aguarda memória |
| 14 | ac:=mbr + ac; goto 0; | Executa | ADDD Fim |
| 15 | mar:=ir; rd; | {0011 = SUBD} | {0011 = SUBD} Início |
| 16 | ac:=ac + 1; rd; | Executa | Prepara complemento de 2 |
| 17 | a:=inv(mbr); | Executa | Inverte MBR |
| 18 | ac:=ac + a; goto 0; | Executa | SUBD Fim |
| 19 | tir:=lshift(tir); if n then goto 25; | Identifica | Decodificação de saltos |
| 20 | alu:=tir; if n then goto 23; | | Decodificação |
| 21 | alu:=ac; if n then goto 0; | {0100 = JPOS} | JPOS: se neg, não pula |
| 22 | pc:=band(ir, amask); goto 0; | | Efetua o pulo (PC := endereço) |
| 23 | alu:=ac; if z then goto 22; | {0101 = JZER} | JZER: se zero, pula |
| 24 | goto 0; | | Fim JZER |
| 25 | alu:=tir; if n then goto 27; | | Decodificação |
| 26 | pc:=band(ir, amask); goto 0; | {0110 = JUMP} | {0110 = JUMP} |
| 27 | ac:=band(ir, amask); goto 0; | {0111 = LOCO} | {0111 = LOCO} |
| 28 | tir:=lshift(ir + ir); if n then goto 40; | | Decodificação instruções 1xxx |
| 29 | tir:=lshift(tir); if n then goto 35; | | Decodificação |
| 30 | alu:=tir; if n then goto 33; | | Decodificação |
| 31 | a:=ir + sp; | {1000 = LODL} | Calcula endereço local |
| 32 | mar:=a; rd; goto 7; | | {1000 = LODL} |
| 33 | a:=ir + sp; | {1001 = STOL} | |
| 34 | mar:=a; mbr:=ac; wr; goto 10; | | {1001 = STOL} |
| 35 | alu:=tir; if n then goto 38; | | |
| 36 | a:=ir + sp; | {1010 = ADDL} | |
| 37 | mar:=a; rd; goto 13; | | {1010 = ADDL} |
| 38 | a:=ir + sp; | {1011 = SUBL} | |
| 39 | mar:=a; rd; goto 16; | | {1011 = SUBL} |
| 40 | tir:=lshift(tir); if n then goto 46; | | |
| 41 | alu:=tir; if n then goto 44; | | |
| 42 | alu:=ac; if n then goto 22; | {1100 = JNEG} | {1100 = JNEG} |
| 43 | goto 0; | | | |
| 44 | alu:=ac; if z then goto 0; | | {1101 = JNZE} | |
| 45 | pc:=band(ir, amask); goto 0; | {1101 = JNZE} |
| 46 | tir:=lshift(tir); if n then goto 50; | | |
| 47 | sp:=sp + (-1); | {1110 = CALL} | Prepara pilha para CALL |
| 48 | mar:=sp; mbr:=pc; wr; | | Salva PC na pilha |
| 49 | pc:=band(ir, amask); wr; goto 0; | | {1110 = CALL} |
| 50 | tir:=lshift(tir); if n then goto 65; | | Instruções 1111xxxx |
| 51 | tir:=lshift(tir); if n then goto 59; | | |
| 52 | alu:=tir; if n then goto 56; | | |
| 53 | mar:=ac; rd; | {1111-0000 = PSHI} | {1111-0000 = PSHI} |
| 54 | sp:=sp + (-1); rd; | | |
| 55 | mar:=sp; wr; goto 10; | | |
| 56 | mar:=sp; sp:=sp + 1; rd; | {1111-0010 = POPI} | {1111-0010 = POPI} |
| 57 | rd; | | |
| 58 | mar:=ac; wr; goto 10; | | |
| 59 | alu:=tir; if n then goto 62; | | |
| 60 | sp:=sp + (-1); | {1111-0100 = PUSH} | {1111-0100 = PUSH} |
| 61 | mar:=sp; mbr:=ac; wr; goto 10; | | |
| 62 | mar:=sp; sp:=sp + 1; rd; | {1111-0110 = POP} | {1111-0110 = POP} |
| 63 | rd; | | |
| 64 | ac:=mbr; goto 0; | | |
| 65 | tir:=lshift(tir); if n then goto 73; | | |
| 66 | alu:=tir; if n then goto 70; | | |
| 67 | mar:=sp; sp:=sp + 1; rd; | {1111-1000 = RETN} | {1111-1000 = RETN} |
| 68 | rd; | | |
| 69 | pc:=mbr; goto 0; | | |
| 70 | a:=ac; | {1111-1010 = SWAP} | {1111-1010 = SWAP} |
| 71 | ac:=sp; | | |
| 72 | sp:=a; goto 0; | | |
| 73 | alu:=tir; if n then goto 76; | | |
| 74 | a:=band(ir, smask); | {1111-1100 = INSP} | {1111-1100 = INSP} |
| 75 | sp:=sp + a; goto 0; | | |
| 76 | a:=band(ir, smask); | {1111-1110 = DESP} | {1111-1110 = DESP} |
| 77 | a:=inv(a); | | |
| 78 | a:=a + 1; goto 75; | | Complemento de 2 para sub |

<p align="center">
  <img src="mic-1.jpeg" alt="Diagrama da arquitetura MIC-1" />
</p>


### Regras da Memória Principal

Endereços: 
  1 a 1000 - instruções
  1001 a 2000 - dados
  3001 a 4095 - 
  
### Componentes

Deslocador: é uma extensão da ULA controlada por duas linhas independentes. Implementei o comportamento exato do livro: o sra1 duplica o bit de sinal mais alto (bit 15) ao deslocar para a direita, preservando valores negativos, enquanto o sll8 desloca 8 bits para a esquerda, inserindo zeros. Esse deslocamento de 8 bits é vital no hardware real para alinhar os bytes de instruções e deslocamentos que vêm da memória.


MAR: é o nosso registrador de acoplamento com a memória. Enquanto os outros registradores internos do Data Path operam em 16 bits, o MAR possui uma máscara rígida de hardware de 12 bits (& 0x0FFF). Isso foi feito por dois motivos: primeiro, porque reflete o limite físico do chip MIC-1; segundo, porque protege a integração com o módulo de memória desenvolvido pelo grupo, garantindo que nenhum endereço inválido além de 4095 seja requisitado. Ele é conectado diretamente ao Barramento C. Quando o circuito processa algo e decide acessar a memória, o Shifter joga o endereço no Barramento C, e o MAR captura esse valor.


MBR: é o componente onde a mágica da integração do nosso grupo acontece. Como a nossa memória RAM armazena strings binárias e o nosso Data Path processa números inteiros de 16 bits, nós centralizamos a conversão de tipos dentro do MBR. Ele atua como um transdutor de sinal: converte dados numéricos do Barramento C em strings binárias para a RAM e vice-versa, mantendo o restante das peças do processador puras e focadas em suas respectivas funções lógicas.


PC: controla o fluxo de execução sequencial do nosso simulador. Ele opera estritamente com endereços de 12 bits, aplicando a máscara & 0x0FFF no método write. Um ponto importante da nossa modelagem de hardware é que, diferente do IR que só recebe strings, o PC envia e recebe dados numéricos através dos Barramentos B e C. Isso é fundamental para que a nossa ULA consiga realizar a aritmética de incremento ($PC = PC + 1$) ou processar desvios condicionais de forma direta e eficiente.


Registrador AC: é o coração do armazenamento temporário no Data Path do MIC-1. No código, implementamos o isolamento dele garantindo que ele opere estritamente em 16 bits através da máscara binária & 0xFFFF. Um ponto chave do nosso design é que ele aceita tanto inteiros quanto strings binárias no método write, garantindo total compatibilidade com a memória de strings desenvolvida pelo grupo, sem violar a simulação dos barramentos.


Registrador CPP: é o registrador que aponta para o início da área da memória RAM onde ficam guardadas as constantes do seu programa (valores fixos que não mudam, como strings ou números específicos definidos no código). Quando o processador executa a instrução LDC_W (carregar constante), ele usa o valor contido no CPP como base para achar o número na memória.


Registrador LV: é o registrador que aponta para a base do quadro de variáveis locais da função que está sendo executada no momento. Ele funciona como uma "âncora" na memória. Quando o seu processador precisa ler a primeira variável local (instrução ILOAD 1, por exemplo), a ULA faz a conta: valor de LV + deslocamento 1.


Registrador OPC: é um registrador de rascunho muito específico do MIC-1. Ele serve para salvar temporariamente o endereço da instrução anterior ou atual quando o processador precisa fazer um desvio (como um salto condicional ou a chamada de um método). Ele também é vital para ajudar a calcular o endereço de destino em instruções de desvio relativo, servindo como uma memória de curto prazo para o PC.


Registrador SP: é o registrador encarregado de controlar a pilha de memória, crucial para a passagem de parâmetros e variáveis locais em chamadas de subrotinas (métodos). No MIC-1, ele pode ser incrementado ou decrementado dependendo de operações de empilhamento. No simulador, ele opera nativamente em 16 bits, garantindo o comportamento de wrap-around caso a pilha estoure os limites físicos.


Registrador TOS: é um registrador de otimização de desempenho genial que o Tanenbaum colocou no MIC-1. Em vez de o processador ter que ir toda hora até a memória RAM para ler o valor que está no topo da pilha, o TOS mantém uma cópia exata desse valor guardada direto dentro do chip. Isso economiza dezenas de ciclos de clock durante operações aritméticas (como somar os dois últimos números da pilha).


Registrador Y: a ULA do MIC-1 não pode receber duas variáveis diretamente dos barramentos ao mesmo tempo porque causaria um conflito de sinais elétricos. Por isso, o registrador Y existe como uma 'âncora'. A Unidade de Controle isola o primeiro operando dentro de Y em um ciclo anterior, para que no ciclo seguinte a ULA possa somar o valor estável de Y com qualquer outro registrador vindo do Barramento B.








PC -> MAR (aponta o endereço) -> RAM (busca a string) -> MBR (recebe o dado) -> IR (guarda a instrução para a UC)


this.flagN = ((resultado & 0x8000) !== 0) ? 1 : 0;

  1111 1111 1111 1111  (Resultado da ULA = -1)
& 1000 0000 0000 0000  (Máscara 0x8000)
---------------------
  1000 0000 0000 0000  (O resultado final dá 0x8000)


No JavaScript, todos os operadores bit a bit (<<, >>) operam em 32 bits. Se nós fizéssemos apenas resultado >> 1, o JavaScript traria um bit 0 para o bit 15 caso o número fosse considerado positivo em 32 bits, quebrando o Complemento de Dois de 16 bits do MIC-1!

A linha (resultado << 16) >> 16 é um truque genial: ela joga o bit 15 do seu processador lá para o topo do registrador de 32 bits do JavaScript e depois puxa de volta. Isso força o JavaScript a entender que aquele número de 16 bits é um número sinalizado de verdade. Quando aplicamos o >> 1, o bit de sinal é duplicado perfeitamente.


// 0x00 - MAIN1: Inicia a busca da macroinstrução enviando o PC para o MAR
microprograma[0x00] = {
    label: "Main1",
    bbus: 1,         
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0, // Passa PC direto pela ULA
    mar: 1,          // Carrega o endereço do PC no MAR
    read: 1,         // Dispara o sinal de leitura da RAM externa
    nextAddress: 0x1E // Vai para o Main2 esperar o atraso da memória
};

// 0x1E - MAIN2: Ciclo de espera da RAM. Aproveita para atualizar o PC (PC = PC + 1)
microprograma[0x1E] = {
    label: "Main2",
    bbus: 1,         // CORRIGIDO: 0 seleciona o PC
    f0: 1, f1: 1, ena: 1, enb: 1, inva: 0, inc: 1, // ULA calcula: PC + 1
    pc: 1,           // Grava o novo valor de volta no PC
    nextAddress: 0x1F // Vai para o Main3 com o dado já perfeitamente estável no MBR
};

// 0x1F - MAIN3: O dado está 100% seguro no MBR. Dispara o JMPC para decodificar o Opcode!
microprograma[0x1F] = {
    label: "Main3",
    bbus: 3,         // Mantém o barramento em repouso apontando para o MBR (ID 3)
    f0: 0, f1: 0, ena: 0, enb: 0, inva: 0, inc: 0, 
    jamz: 0, jamn: 0, jmpc: 1, // Executa o salto combinacional com base no Opcode do MBR
    nextAddress: 0x00 
};

// 0x01 - STOD: Store Direct (Opcode 0001) -> m[x] := ac
microprograma[0x01] = {
    label: "stod1",
    bbus: 7,         // CORRIGIDO: 3 seleciona o MBR (isola os 12 bits inferiores no barramento)
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0, 
    mar: 1,          // Joga o endereço filtrado direto no MAR
    nextAddress: 0x11
};
microprograma[0x11] = {
    label: "stod2",
    bbus: 1,         // CORRIGIDO: 1 seleciona o Acumulador (AC)
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0, // Passa o valor do AC pela ULA
    mbr: 1,          // Carrega o dado do AC no MBR
    write: 1,        // Ativa o pulso de escrita na RAM externa
    nextAddress: 0x00 // Retorna para o Main1 buscar a próxima instrução
};

// 0x02 - ADDD: Add Direct (Opcode 0010) -> ac := ac + m[x]
microprograma[0x02] = {
    label: "addd1",
    bbus: 7,         // CORRIGIDO: 3 seleciona o MBR (contém o endereço X da variável)
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    mar: 1,          // Carrega o endereço no MAR
    read: 1,         // Dispara a leitura da RAM
    nextAddress: 0x12
};
microprograma[0x12] = {
    label: "addd2",
    // Ciclo de atraso da leitura: O dado vindo da RAM acabou de estabilizar no MBR!
    bbus: 7,         // CORRIGIDO: 3 lê o valor da variável que acabou de chegar no MBR
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    y: 1,            // Trava o valor lido na entrada fixa esquerda da ULA (Reg Y)
    nextAddress: 0x22
};
microprograma[0x22] = {
    label: "addd3",
    bbus: 1,         // CORRIGIDO: 1 seleciona o AC para injetar na direita da ULA
    f0: 1, f1: 1, ena: 1, enb: 1, inva: 0, inc: 0, // ULA calcula combinacionalmente: Y + AC
    ac: 1,           // Grava o resultado da soma de volta no Acumulador
    nextAddress: 0x00 // Ciclo encerrado, volta para o Main1
};

// 0x07 - LOCO: Load Constant (Opcode 0111) -> ac := x
microprograma[0x07] = {
    label: "loco1",
    bbus: 7, 
    f0: 0, f1: 1, ena: 0, enb: 1, inva: 0, inc: 0,
    ac: 1, 
    nextAddress: 0x00
};
