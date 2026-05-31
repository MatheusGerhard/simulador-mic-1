// Microprogram Counter - Contador de Microprograma (MPC)

// Descrição: Registrador interno da Unidade de Controle que aponta para a linha atual da microinstrução (Control Store).

class MicroprogramCounter {
    constructor() {
        this.value = 0;
    }


    // Recebe dado de Mmux
    write(newValue) {
        this.value = newValue;
    }

    // Busca na ROM a próxima microinstrução
    read() {
        return this.value;
    }

    clear() {
        this.value = 0;
    }
}

export default MicroprogramCounter;