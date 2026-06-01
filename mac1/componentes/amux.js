// Amux - 

// Descrição: Recebe o valor do Latch A, MBR e o comando do MIR e seleciona o valor correto para entrar na ALU

class Amux {
    select(aValue, mbrValue, mirValue) {
        if (this.mirValue === "0") {
            return aValue;
        } 
        if (this.mirValue === "1") {
            return mbrValue;
        }
    }
}

export default Amux;