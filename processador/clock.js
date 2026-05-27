// Clock - Relógio

// Descrição: Determina o ritmo de execução de cada microinstrução.
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

export default Clock;