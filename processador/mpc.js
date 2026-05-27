// Microprogram Counter - Contador de Microprograma (MPC)

// Descrição: Registrador interno da Unidade de Controle que aponta para a linha atual da microinstrução (Control Store).

class MicroprogramCounter {
    constructor() {
        this.value = 0; // Começa apontando para a microinstrução 0 (Busca)
    }

    // Lê o endereço atual da microinstrução
    read() {
        return this.value;
    }

    // Modifica o MPC para dar o salto para o próximo passo ou decodificação
    // O operador '& 0x1FF' simula o limite físico de 9 bits.
    write(newValue) {
        this.value = newValue & 0x1FF;
    }
}

export default MicroprogramCounter;