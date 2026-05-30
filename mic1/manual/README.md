### MIC-1 Tanenbaum - 6ª Edição

## Descrição de cada componente:

# Registradores:

| Registrador | Nome Completo           | Descrição                                                                                             |
| :---------- | :---------------------- | :---------------------------------------------------------------------------------------------------- |
| **MAR**     | Memory Address Register | armazena o endereço de memória que será lido ou escrito pela CPU.          |
| **MDR**     | Memory Data Register    | armazena o dado lido da memória ou o dado a ser escrito na memória.        |
| **PC**      | Program Counter         | armazena o endereço da próxima instrução a ser buscada na memória.         |
| **MBR**     | Memory Buffer Register  | rmazena o byte mais recente lido da memória de instruções.                 |
| **SP**      | Stack Pointer           | armazena o endereço de memória do topo da pilha de operandos.              |
| **LV**      | Local Variable Pointer  | aponta para o início do quadro de variáveis locais do método atual na pilha. |
| **CPP**     | Constant Pool Pointer   | aponta para a área de constantes (constant pool) do método atual.          |
| **TOS**     | Top Of Stack            | armazena uma cópia do valor no topo da pilha para otimização de acesso.    |
| **OPC**     | Old Program Counter     | orário, usado para armazenar o valor do PC em operações de salto ou chamadas de sub-rotina. |
| **H**       | Hold Register           | serve como uma das entradas (a esquerda) para a Unidade Lógica e Aritmética (ULA). |

# Componentes:

# ULA

A **Unidade Lógica e Aritmética (ULA)** é o motor de cálculo do simulador. Ela opera sobre 16 bits e é controlada por 6 sinais vindos do MIR:
*   **F0, F1**: Definem a operação (Soma, AND, etc).
*   **ENA, ENB**: Habilitam as entradas A (vindo de H) e B (vindo do Barramento B).
*   **INVA**: Inverte a entrada A.
*   **INC**: Adiciona 1 ao resultado final (útil para complementos de dois e incrementos).

Ela também gera as flags **Z** (Zero) e **N** (Negativo), que são utilizadas pela Unidade de Controle para desvios condicionais.

# Shifter (Deslocador)

O **Shifter** recebe o resultado da ULA e aplica um deslocamento antes de colocar o valor no **Barramento C**. Ele suporta quatro modos:
1.  **Pass-through (00)**: O valor passa sem alteração.
2.  **SRA1 (01)**: Deslocamento aritmético para a direita (preserva o bit de sinal).
3.  **SLL8 (10)**: Deslocamento lógico para a esquerda de 8 bits (usado para alinhar offsets).
4.  **LSHIFT (11)**: Deslocamento lógico para a esquerda de 1 bit.

---

## MACROINSTRUÇÃO (IJVM)

Conjunto de instruções da IJVM (Tanenbaum, 6ª Ed., Figura 4.11).

| Hex | Mnemônico | Significado |
| :---: | :--- | :--- |
| 0x10 | BIPUSH byte | Carregue o byte para a pilha |
| 0x59 | DUP | Copie a palavra do topo da pilha e passe-a para a pilha |
| 0xA7 | GOTO offset | Desvio incondicional |
| 0x60 | IADD | Retire duas palavras da pilha; carregue sua soma |
| 0x7E | IAND | Retire duas palavras da pilha; carregue AND booleano |
| 0x99 | IFEQ offset | Retire palavra da pilha e desvie se for zero |
| 0x9B | IFLT offset | Retire palavra da pilha e desvie se for menor do que zero |
| 0x9F | IF_JCMPEQ offset | Retire duas palavras da pilha; desvie se iguais |
| 0x84 | IINC varnum const | Some uma constante a uma variável local |
| 0x15 | ILOAD varnum | Carregue variável local para pilha |
| 0xB6 | INVOKEVIRTUAL disp | Invoque um método |
| 0xB0 | IOR | Retire duas palavras da pilha; carregue OR booleano |
| 0xAC | IRETURN | Retorne do método com valor inteiro |
| 0x36 | ISTORE varnum | Retire palavra da pilha e armazene em variável local |
| 0x64 | ISUB | Retire duas palavras da pilha; carregue sua diferença |
| 0x13 | LDC_W index | Carregue constante do conjunto de constantes para pilha |
| 0x00 | NOP | Não faça nada |
| 0x57 | POP | Apague palavra no topo da pilha |
| 0x5F | SWAP | Troque as duas palavras do topo da pilha uma pela outra |
| 0xC4 | WIDE | Instrução prefixada; instrução seguinte tem um índice de 16 bits |


## MICROINSTRUÇÕES

Microprograma para a Mic-1 (Tanenbaum, 6ª Ed., Figura 4.17)

| Rótulo | Microinstrução | Significado |
| :--- | :--- | :--- |
| **Main1** | mar = pc; rd | Inicia busca da macroinstrução |
| **Main2** | pc = pc + 1; rd | Incrementa PC para a próxima busca |
| **Main3** | ir = mbr; goto (mbr) | Decodifica e salta para o endereço do opcode |
| **not1** | goto Main1 | Não faça nada |
| **iadd1** | mar = sp = sp - 1; rd | Pega o penúltimo elemento da pilha |
| **iadd2** | h = tos | Coloca o topo atual em H |
| **iadd3** | mdr = tos = h + mdr; wr; goto Main1 | Soma, atualiza o topo e escreve |
| **isub1** | mar = sp = sp - 1; rd | Pega o penúltimo elemento da pilha |
| **isub2** | h = tos | Subtraendo em H |
| **isub3** | mdr = tos = h - mdr; wr; goto Main1 | Subtrai e salva no topo |
| **iand1** | mar = sp = sp - 1; rd | Operação lógica AND |
| **iand2** | h = tos | |
| **iand3** | mdr = tos = h & mdr; wr; goto Main1 | |
| **ior1** | mar = sp = sp - 1; rd | Operação lógica OR |
| **ior2** | h = tos | |
| **ior3** | mdr = tos = h \| mdr; wr; goto Main1 | |
| **dup1** | mar = sp = sp + 1 | Incrementa SP para duplicar |
| **dup2** | mdr = tos; wr; goto Main1 | Escreve cópia do topo na pilha |
| **pop1** | mar = sp = sp - 1; rd | Decrementa SP |
| **pop2** | | Aguarda leitura da memória |
| **pop3** | tos = mdr; goto Main1 | Atualiza o registrador TOS |
| **swap1** | mar = sp - 1; rd | Inicia troca dos dois do topo |
| **swap2** | h = tos | |
| **swap3** | mdr = tos; wr | |
| **swap4** | tos = h | |
| **swap5** | mar = sp - 1; wr; goto Main1 | Finaliza a troca na memória |
| **swap6** | tos = h; goto Main1 | Atualiza TOS |
| **bipush1** | pc = pc + 1; mar = pc; rd | Busca o operando (byte) |
| **bipush2** | | |
| **bipush3** | mdr = mbr | |
| **bipush4** | mar = sp = sp + 1; wr | Empilha o byte |
| **bipush5** | tos = mdr; goto Main1 | Atualiza TOS |
| **iload1** | pc = pc + 1; mar = pc; rd | Busca o índice da variável local |
| **iload2** | h = lv | LV é a base do quadro local |
| **iload3** | mar = h + mbr; rd | Lê o valor da variável |
| **iload4** | pc = pc + 1; fetch; wr | Incremente PC; obtenha o próximo opcode, escreva topo da pilha |
| **iload5** | mdr = tos; goto Main1| Atualize TOS |
| **istore1** | pc = pc + 1; mar = pc; rd | Busca índice para salvar |
| **istore2** | h = lv | |
| **istore3** | mar = h + mbr; mdr = tos; wr | Salva o topo na variável |
| **istore4** | mar = sp = sp - 1; rd | Remove da pilha |
| **istore5** | | |
| **istore6** | tos = mdr; goto Main1 | Atualiza novo TOS |
| **goto1** | pc = pc + 1; mar = pc; rd | Busca offset do pulo |
| **goto2** | h = mbr << 8 | Desloca byte alto |
| **goto3** | pc = pc + 1; mar = pc; rd | Busca byte baixo |
| **goto4** | h = h OR mbr | Monta offset de 16 bits |
| **goto5** | pc = pc + h - 1 | Efetua o pulo relativo |
| **goto6** | mar = pc; rd; goto Main2 | Reinicia busca no novo endereço |
| **ifeq1** | mar = sp = sp - 1; rd | Retira topo para testar |
| **ifeq2** | | |
| **ifeq3** | tos = mdr | |
| **ifeq4** | if (Z) goto goto1; else goto Main1 | Pula se o valor for zero |
| **iflt1** | mar = sp = sp - 1; rd | Retira topo para testar |
| **iflt2** | | |
| **iflt3** | tos = mdr | |
| **ifeq4** | if (N) goto goto1; else goto Main1 | Pula se o valor for negativo |
