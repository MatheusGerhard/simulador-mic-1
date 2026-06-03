
## Visão Geral da Arquitetura

O projeto é dividido em quatro camadas independentes:

```
processadorsim/
├── mac1/           # Unidade de Controle + componentes do datapath
├── processador/    # Memória principal (RAM compartilhada) e registradores
├── montador/       # Assembler de dois passes (tokenizador → código de máquina)
└── src/            # Interface React (visualização e controle)
```

---

## Componentes do MAC-1 (`mac1/componentes/`)

O datapath é implementado como objetos JavaScript independentes que se comunicam via leitura/escrita direta. Os principais são:

| Componente | Descrição |
|---|---|
| `Clock` | Gera pulsos divididos em 4 subciclos por microinstrução |
| `ControlStore (cs)` | ROM de 512 posições com o microprograma completo do MAC-1 |
| `MIR` | Registrador de microinstrução: decodifica os campos `amux`, `alu`, `sh`, `mbr`, `mar`, `enc`, `cond`, `addr`, `a`, `b`, `c` |
| `MPC` | Contador de microprograma (aponta para a próxima microinstrução) |
| `ALU` | Realiza operações aritméticas e lógicas; expõe flags `Z` (zero) e `N` (negativo) |
| `AMUX` | Multiplexador de entrada A da ALU (escolhe entre Latch A ou MBR) |
| `MMUX` | Multiplexador do próximo endereço de microinstrução |
| `MSL` | Lógica de desvio condicional (usa flags Z/N + campo `cond` do MIR) |
| `Shifter` | Deslocador de bits (left/right shift) na saída da ALU |
| `MAR / MBR` | Registradores de endereço e dado de memória |
| `Registers` | Banco de registradores (PC, AC, SP, IR, TIR, etc.) |
| `LatchA / LatchB` | Buffers intermediários do datapath |
| `Increment` | Incrementador do MPC |

---

## A Unidade de Controle (`mac1/controlUnit.js`)

A `ControlUnit` orquestra todos os componentes e executa cada microinstrução em **4 subciclos fixos**:

```
Subciclo 1 — Fetch da microinstrução
  MPC → CS → MIR

Subciclo 2 — Busca dos operandos
  DecoderA/B/C decodificam os campos a/b/c do MIR
  LatchA ← Registrador[A]
  LatchB ← Registrador[B]

Subciclo 3 — Execução
  MAR ← LatchB  (se mir.mar = 1)
  MBR ← RAM[MAR] ou RAM ← MBR  (leitura/escrita conforme mir.wr)
  AMUX → ALU → Shifter

Subciclo 4 — Write-back e próximo endereço
  Registrador[C] ← Shifter  (se mir.enc = 1)
  MSL avalia condição de desvio
  MMUX seleciona próximo MPC
```

---

## O Clock (`mac1/componentes/clock.js`)

O `Clock` controla o ritmo de execução via `setInterval`:

```js
clock.setVelocidade(250);  // intervalo em ms entre subciclos
clock.iniciar(uc);         // inicia execução contínua
clock.pausar();            // para a execução
clock.resetClock();        // reinicia contadores
```

Cada tick chama `uc.rodarCiclo(subciclo)`, onde `subciclo` vai de 1 a 4 ciclicamente. Um ciclo completo (4 subciclos) executa **uma microinstrução**.

---

## O Montador (`montador/`)

O assembler converte código Assembly MAC-1 em palavras binárias de 16 bits e as grava na memória.

### Fluxo em três etapas

**1. Tokenização** (`tokeniza_codigo`)
Cada linha é separada em `{ rotulo, rotulo_index, opcode, operando }`. Comentários iniciados por `;` são descartados. Valida opcodes e ranges de operandos.

**2. Primeira passagem** (`primeira_passagem`)
Resolve rótulos — substitui referências simbólicas (ex: `JUMP loop`) pelo endereço numérico correspondente. Roda em O(n²) para garantir que rótulos declarados depois de seu uso também sejam resolvidos.

**3. Segunda passagem** (`segunda_passagem`)
Converte cada instrução em binário de 16 bits: 4 bits de opcode + 12 bits de operando (ou 8 bits para `INSP`/`DESP`).

### Conjunto de instruções suportado

| Grupo | Instruções |
|---|---|
| Memória direta | `LODD`, `STOD`, `ADDD`, `SUBD` |
| Memória local (SP) | `LODL`, `STOL`, `ADDL`, `SUBL` |
| Desvios | `JPOS`, `JZER`, `JNEG`, `JNZE`, `JUMP`, `CALL` |
| Imediato | `LOCO` |
| Pilha | `PUSH`, `POP`, `PSHI`, `POPI` |
| Outros | `RETN`, `SWAP`, `INSP`, `DESP` |

### Exemplo de programa

```asm
LOCO 10      ; AC ← 10
STOD 100     ; MEM[100] ← AC
LOCO 20      ; AC ← 20
ADDD 100     ; AC ← AC + MEM[100]
STOD 101     ; MEM[101] ← AC  (resultado: 30)
```

---

## A Interface de Simulação (`src/`)

### Layout principal (`App.jsx`)

A tela é dividida em três painéis lado a lado:

```
┌──────────┐  ┌────────────┐  ┌──────────────┐
│  Memory  │  │ Simulation │  │ Instructions │
└──────────┘  └────────────┘  └──────────────┘
```

---

### Painel Memory (`src/components/memory/`)

É o painel de controle central da simulação. Contém:

**Botões de controle:**
- `Clear` — limpa toda a RAM e reseta a UC e o Clock
- `►` — chama `executa(clock, uc)`, iniciando a execução com velocidade de 250 ms/subciclo
- `||` — chama `clock.pausar()`, suspendendo a execução sem perder estado

**Slots de visualização de memória:**
Suporta até 4 instâncias do componente `MemoryDisplay` abertas simultaneamente. Cada slot pode ser aberto (`+`) ou fechado (`×`) independentemente.

```jsx
// Estado que controla quais slots estão visíveis
const [memoryNum, setMemoryNum] = useState([1, 0, 0, 0]);
```

---

### MemoryDisplay (`src/components/memory/memoryDisplay/`)

Cada janela de memória exibe o conteúdo da RAM e se atualiza automaticamente a cada 100 ms via `setInterval`, refletindo em tempo real as escritas do processador:

```js
useEffect(() => {
    const interval = setInterval(() => {
        setData([...memoria.data]); // snapshot do array a cada 100ms
    }, 100);
    return () => clearInterval(interval);
}, []);
```

**Funcionalidades:**
- **Troca de base** — botão alterna entre binário (16 dígitos) e decimal
- **Carregamento progressivo** — exibe 100 linhas por vez; botão `+` carrega mais 100
- **Busca por endereço** — painel de settings aceita um número de linha e rola automaticamente até ela (`scrollIntoView`)

---

### Painel Instructions (`src/components/instructions/`)

Painel colapsável ativado por um botão flutuante. Quando aberto, exibe o `InstructionDisplay`:

- **Textarea** para digitar o código Assembly
- **Botão "Montar Programa"** que instancia o `Montador`, executa as três etapas de montagem e chama `montador.preencherMemoria()` para gravar o binário na RAM
- Erros de montagem são exibidos via `alert()` com a linha problemática

---

### Painel Simulation (`src/components/SImulation/`)

Reservado para a visualização gráfica futura do datapath (5 divs posicionadas via CSS, correspondendo aos blocos visuais do processador MAC-1).

---

## Como Executar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`. O fluxo de uso é:

1. Abrir o painel **Instructions** e digitar o código Assembly
2. Clicar em **Montar Programa** — o código é compilado e gravado na RAM
3. Abrir uma janela de **MemoryDisplay** para inspecionar a memória
4. Clicar em **►** para iniciar a execução
5. Usar **||** para pausar e inspecionar o estado intermediário
6. Usar **Clear** para reiniciar tudo

---

## Dependências

| Pacote | Versão | Papel |
|---|---|---|
| react | ^19 | UI reativa |
| vite | ^8 | Bundler/dev server |
| @vitejs/plugin-react | ^6 | Suporte JSX com Oxc |
)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
