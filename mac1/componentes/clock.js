// Clock - Relógio

// Descrição: Determina o ritmo de execução de cada microinstrução.
// Envia: Pulsos (ticks) para a Unidade de Controle e demais componentes sincronizados.

class Clock {
    constructor() {
        this.subciclo = 1;
        this.totalCiclos = 0;
        this.intervaloMs = 1000;
        this.emExecucao = false;
        this.timerId = null;
    }

    
    setVelocidade(ms) {
        this.intervaloMs = ms;
    }

    subPulso(controlUnit) {
        controlUnit.rodarCiclo(this.subciclo);        
        this.subciclo++;
        if (this.subciclo > 4) {
            this.subciclo = 1;
        }
    }

    pulso(controlUnit) {
        for (let i = 1; i <= 4; i++) {
            this.subPulso(controlUnit);
        }
        this.totalCiclos++;
    }

    // Liga o processador em modo contínuo
    iniciar(controlUnit) {
        if (this.emExecucao) return;
        this.emExecucao = true;

        this.timerId = setInterval(() => {
        if (!this.emExecucao) {
            clearInterval(this.timerId);
            return;
        }
        
        this.subPulso(controlUnit);
        
    }, this.intervaloMs);
    }

    pausar() {
        this.emExecucao = false;
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }

    getCycles() {
        return this.totalCiclos;
    }
    getSC() {
        return this.subciclo;
    }

    reset() {
        this.pausar();
        this.totalCiclos = 0;
    }
}

export default Clock;