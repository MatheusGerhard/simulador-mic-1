// Microprogram Counter - Contador de Microprograma (MPC)

// Descrição: Registrador interno da Unidade de Controle que aponta para a linha atual da microinstrução (Control Store).

class MicroprogramCounter {
    constructor() {
        this.jump = "0"; // Começa apontando para a microinstrução 0 (Busca)
        this.o = "00000000"; // Começa apontando para a microinstrução 0
    }


    // Recebe dado da ULA e O (Addr e J)
    write(regName, newValue) {
        this[regName] = newValue;
    }

    // Busca na ROM a próxima microinstrução
    read() {
        return this.jump + this.o;
    }

    clear() {
        this.jump = "0";
        this.o = "00000000";
    }
}

export default MicroprogramCounter;