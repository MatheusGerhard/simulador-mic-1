// Clock.js

class Clock {
    constructor() {
        this.pulsos = 0;
        this.intervaloMs = 1000;
        this.emExecucao = false;
        this.timerId = null;
        this.halt = 0;
    }

    setVelocidade(ms) {
        this.intervaloMs = ms;
    }

    pulso(controlUnit) {
        if (this.halt > 1) {
            this.halt--;
            this.pulsos++;
            console.log("-------------- " + this.pulsos + " --------------");
            console.log("Espere.");
        }
        else {
            console.log("-------------- " + this.pulsos + " --------------");
            let teste = controlUnit.rodarCiclo(this.subciclo, this.pulsos);
            if (teste == false) {
                console.log("Cache miss!");
                this.halt = 1;
            }
            else {
                this.pulsos++;
            }
        }
    }

    iniciar(controlUnit) {
        if (this.emExecucao) return;
        this.emExecucao = true;

        this.timerId = setInterval(() => {
            if (!this.emExecucao) {
                clearInterval(this.timerId);
                return;
            }

            this.pulso(controlUnit);

        }, this.intervaloMs);
    }

    pausar() {
        this.emExecucao = false;
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }

    getPulsos() {
        return this.pulsos;
    }

    reset() {
        this.pausar();
        this.pulsos = 0;
        if (this.onCicloChange) this.onCicloChange(this.pulsos); // Zera a tela também
    }

    resetClock() {
        this.pulsos = 0;
        this.emExecucao = false;
        this.timerId = null;
        if (this.onCicloChange) this.onCicloChange(this.pulsos);
    }
}

export default Clock;