// Local Variable - Variáveis Locais (LV)

// Descrição: armazena o endereço de memória onde começa o bloco de variáveis locais da função que está rodando exatamente agora.


class LocalVariableRegister {
    constructor() { this.value = 0; }
    read() { return this.value; }
    write(newValue) { this.value = newValue & 0xFFFF; }
}
export default LocalVariableRegister;