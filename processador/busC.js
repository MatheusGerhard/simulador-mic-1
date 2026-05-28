// Bus C - Barramento C (cbus)

// Descrição: Barramento de distribuição de escrita.
// Recebe: o dado final que saiu do Shifter.
// Envia: O dado para os registradores ativados pelo MIR.

class BusC {
    // O método recebe o valor final (pós-shifter) e o mapa de sinais de escrita
    distribuir(valorShifter, registradores, mir) {

        // REGISTRADORES DE 12 BITS - Isola os 12 LSB

        // MAR (Memory Address Register) 
        if (mir.mar) {
            const valor12Bits = valorShifter.slice(-12).padStart(16, "0");
            registradores.mar.write(valor12Bits);
        }

        // PC (Program Counter)
        if (mir.pc) {
            const valor12Bits = valorShifter.slice(-12).padStart(16, "0");
            registradores.pc.write(valor12Bits);
        }

        // REGISTRADORES DE 16 BITS (Dados e Ponteiros de Pilha)

        // MBR (Memory Buffer Register)
        if (mir.mbr) {
            registradores.mbr.write(valorShifter);
        }

        // AC (Accumulator)
        if (mir.ac) {
            registradores.ac.write(valorShifter);
        }

        // Y (Registrador Y)
        if (mir.y) {
            registradores.y.write(valorShifter);
        }

        // SP (Stack Pointer)
        if (mir.sp) {
            registradores.sp.write(valorShifter);
        }
    }
}

export default BusC;