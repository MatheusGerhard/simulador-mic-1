// Shifter - Deslocador

// Descrição: Recebe a saída de 16 bits da ULA e aplica deslocamentos antes de jogar o dado no Barramento C.
// Controle: Controlado por 2 bits de sinais (sra1 e sll8) vindos da microinstrução.

class Shifter {
    // O método recebe o valor vindo da ULA e os sinais de controle do Shifter
    deslocar(valorULA, sinais) {
        // sinais é um objeto contendo: { sra1, sll8 }
        
        // Garante que estamos manipulando um dado purista de 16 bits
        let dado = valorULA & 0xFFFF;

        // 1. SRA1: Deslocamento Aritmético para a Direita (1 bit)
        if (sinais.sra1) {
            // No JavaScript, o operador '>>' já é um deslocamento aritmético (preserva o sinal).
            // Porém, o JS trabalha com 32 bits internamente. Para simular 16 bits corretamente:
            
            // Passo A: Força o número de 16 bits a ser interpretado como com sinal (complemento de dois)
            let comSinal16 = (dado & 0x8000) ? (dado | 0xFFFF0000) : dado;
            
            // Passo B: Desloca 1 bit para a direita
            let resultado = comSinal16 >> 1;
            
            // Passo C: Isola os 16 bits finais para o Barramento C
            return resultado & 0xFFFF;
        }

        // 2. SLL8: Deslocamento Lógico para a Esquerda (8 bits)
        if (sinais.sll8) {
            // Desloca 8 bits para a esquerda e passa pela "peneira" de 16 bits
            return (dado << 8) & 0xFFFF;
        }

        // 3. Nenhum sinal ativo: O dado passa direto sem alterações
        return dado;
    }
}

export default Shifter;