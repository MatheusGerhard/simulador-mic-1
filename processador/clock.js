// Clock - Relógio

// Descrição: Determina o ritmo de execução de cada microinstrução.
// Envia: Pulsos (ticks) para a Unidade de Controle e demais componentes sincronizados.


class Clock {
    constructor() {
        this.totalCiclos = 0; // Contador de quantos pulsos já aconteceram
        this.intervaloMs = 1000; // Velocidade padrão: 1 batida a cada 1000ms (1 segundo)
        this.emExecucao = false; // Flag para o botão de Play/Pause do Frontend
    }

    // Esse método recebe a Unidade de Controle e dá um "pulso" nela
    pulso(controlUnit) {
        controlUnit.rodaCiclo();
        this.totalCiclos++;
    }

    // Configura a velocidade do processador (em milissegundos)
    setVelocidade(ms) {
        this.intervaloMs = ms;
    }

    // Cria uma pausa elétrica controlada
    esperarProximaBatida() {
        return new Promise(resolve => setTimeout(resolve, this.intervaloMs));
    }

    // Um loop automatizado que respeita o tempo do temporizador
    async iniciarLoop(controlUnit, verificarFimSimulacao) {
        this.emExecucao = true;

        while (this.emExecucao) {
            // 1. Dá o pulso elétrico na UC
            this.pulso(controlUnit);

            // 2. Verifica se o programa chegou ao fim (ex: PC > 5 ou instrução HALT)
            if (verificarFimSimulacao()) {
                this.emExecucao = false;
                break;
            }

            // 3. Espera o tempo determinado antes da próxima batida
            // Isso impede que o navegador trave e permite que o frontend atualize os leds e registradores na tela!
            await this.esperarProximaBatida();
        }
    }

    // NOVO MÉTODO: Pausa o processador
    pausar() {
        this.emExecucao = false;
    }
}

export default Clock;