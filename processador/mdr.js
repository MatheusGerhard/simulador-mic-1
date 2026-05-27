// Memory Data Register / Registrador de Dados de Memória (MDR)

// Descrição: Atua como um buffer de dados entre a CPU e a memória.
// Recebe: Dados vindos da Memória Principal (leitura) ou do AC (escrita).
// Envia: Dados para o IR, AC ou de volta para a Memória Principal.

class MDR {
    // Implementação do registro de dados aqui
    constructor() {
        this.value = 0;
    }

    get() { return this.value; }
    set(val) { this.value = val & 0xFFFF; }
}
