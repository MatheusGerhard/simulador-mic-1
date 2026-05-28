// Bus B - Barramento B (busB.js)

// Descrição: Linha de leitura que seleciona um único registrador para enviar seu valor para a entrada direita da ULA.
// Recebe: O código de seleção de 4 bits (mir.bbus) e o objeto com todos os registradores.
// Envia: Um valor de 16 bits para a ULA.

class BusB {
    constructor() {}

    // Um multiplexador de hardware
    read(registradores, bbus) {
        // bbus é o código numérico (0 a 8) vindo do MIR
        switch (bbus) {
            case 1: // PC (Program Counter)
                return registradores.pc.read();

            case 2:  // AC (Accumulator)
                return registradores.ac.read();

            case 3: // SP (Stack Pointer)
                return registradores.sp.read();

            case 7: // MBR - Onde chegam as macroinstruções e dados da RAM
                // Isola os 12 bits inferiores para descartar o Opcode e manter apenas o dado/constante
                return "0000" + registradores.mbr.read().slice(-12);

            default:
                // Se o código for inválido ou nenhum registrador colocar dados na via (ex: código 9 a 15)
                return "0000000000000000";
        }
    }
}

export default BusB;