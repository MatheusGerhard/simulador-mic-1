// Microprogram Counter - Contador de Microprograma (MPC)

// Descrição: Registrador interno da Unidade de Controle que aponta para a linha atual da microinstrução (Control Store).

class MicroprogramCounter {
    constructor() {
        this.value = "0000000000000000"; // Começa apontando para a microinstrução 0 (Busca)
    }

    // Lê o endereço atual da microinstrução
    read() {
        return this.value;
    }

    // Modifica o MPC para dar o salto para o próximo passo ou decodificação
    write(newValue) {
        this.value = newValue;
    }

    clear() {
        this.value = "0000000000000000";
    }
}

export default MicroprogramCounter;