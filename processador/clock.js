// Clock - Relógio

// Descrição: Gerador de sinais de sincronização para o processador. 
// Determina o ritmo de execução de cada microinstrução.
// Recebe: Um sinal de início (start) ou uma frequência definida.
// Envia: Pulsos (ticks) para a Unidade de Controle e demais componentes sincronizados.


class Clock {
    constructor() {
        this.totalCiclos = 0; // Contador de quantos pulsos já aconteceram
    }

    // Esse método recebe a Unidade de Controle e dá um "pulso" nela
    pulso(controlUnit) {
        controlUnit.rodaCiclo();
        this.totalCiclos++;
    }
}

const clock = new Clock();
export default clock;