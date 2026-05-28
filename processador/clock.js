// Clock - Relógio

// Descrição: Determina o ritmo de execução de cada microinstrução.
// Envia: Pulsos (ticks) para a Unidade de Controle e demais componentes sincronizados.

class Clock {
    constructor() {
        this.totalCiclos = 0;       // Contador de quantos pulsos já aconteceram
        this.intervaloMs = 1000;    // Velocidade padrão: 1 batida a cada 1000 ms (1 segundo)
        this.emExecucao = false;    // Flag para o botão de Play/Pause do Frontend
        this.timerId = null;        // Guarda a referência do loop de tempo do JavaScript
    }

    // Esse método recebe a Unidade de Controle, dá um "pulso" nela e retorna o sucesso da operação
    pulso(controlUnit) {
        const sucesso = controlUnit.rodarCiclo();
        if (sucesso) {
            this.totalCiclos++;
        }
        return sucesso; // CORRIGIDO: Retorna true ou false para o loop saber se continua
    }

    // Configura a velocidade do processador (em milissegundos)
    setVelocidade(ms) {
        this.intervaloMs = ms;
    }

    // Liga o processador em modo contínuo (Botão Play)
    iniciar(controlUnit) {
        if (this.emExecucao) return; // Evita duplicar timers se clicar em Play várias vezes

        this.emExecucao = true;

        // Cria o loop baseado nos milissegundos configurados
        const loop = () => {
            if (!this.emExecucao) return;

            // Executa o ciclo atual. Se o programa terminar, para o clock automaticamente.
            const continuou = this.pulso(controlUnit);
            
            if (continuou) {
                // Agenda o próximo pulso de clock
                this.timerId = setTimeout(loop, this.intervaloMs);
            } else {
                this.pausar();
            }
        };

        // Dispara o primeiro pulso imediatamente (sem esperar o primeiro segundo passar)
        loop(); 
    }

    // Pausa o processador
    pausar() {
        this.emExecucao = false;
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
    }

    // Retorna o total de ciclos executados para o painel de status
    getCycles() {
        return this.totalCiclos;
    }

    // Reseta o estado do relógio
    reset() {
        this.pausar();
        this.totalCiclos = 0;
    }
}

export default Clock;