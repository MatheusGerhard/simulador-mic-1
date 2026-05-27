// Top of Stack - Topo da Pilha (TOS)

// Descrição: O TOS é um registrador que funciona como um "espelho" ou um cache do valor que está guardado na célula de memória apontada pelo SP.
// Mandar o endereço do SP para a memória. Esperar a memória responder (o que é muito lento). Pegar o dado para só então somar


class TopOfStackRegister {
    constructor() { this.value = 0; }
    read() { return this.value; }
    write(newValue) { this.value = newValue & 0xFFFF; }
}
export default TopOfStackRegister;