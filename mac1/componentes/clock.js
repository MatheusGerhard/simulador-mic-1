// Clock.js

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
        controlUnit.rodarCiclo(this.subciclo,this.totalCiclos);        
        this.subciclo++;
        if (this.subciclo > 4) {
            this.subciclo = 1;
            this.totalCiclos++;
            
        }
        
    }

    pulso(controlUnit) {
        for (let i = 1; i <= 4; i++) {
            this.subPulso(controlUnit);
        }
        // Atualiza a interface caso seja um pulso manual inteiro
        if (this.onCicloChange) this.onCicloChange(this.totalCiclos);
    }

    iniciar(controlUnit) {
        if (this.emExecucao) return;
        this.emExecucao = true;

        this.timerId = setInterval(() => {
            if (!this.emExecucao) {
                clearInterval(this.timerId);
                return;
            }
            
            if (this.subciclo == 1) console.log("=============== "+this.totalCiclos+" ===============");
            console.log("-------------- "+this.subciclo+" --------------");
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
        if (this.onCicloChange) this.onCicloChange(this.totalCiclos); // Zera a tela também
    }

    resetClock() {      
        this.subciclo = 1;
        this.totalCiclos = 0;
        this.emExecucao = false;
        this.timerId = null;
        if (this.onCicloChange) this.onCicloChange(this.totalCiclos);
    }
}

export default Clock;