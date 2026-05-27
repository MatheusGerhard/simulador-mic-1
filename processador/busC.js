// Bus C - Barramento C

// Descrição: Barramento de distribuição de escrita. Pega o dado final que saiu do Shifter e grava nos registradores selecionados pelos sinais de controle.
// Controle: Recebe um objeto de sinais de 9 bits (ex: { ac: true, sp: false, ... })

class BusC {
    // O método recebe o valor final (pós-shifter) e o mapa de sinais de escrita
    distribuir(valorFinal, sinaisC, registradores) {
        // valorFinal já vem truncado em 16 bits pelo Shifter
        // registradores é o objeto com as instâncias: { mar, mbr, pc, ac, sp, lv, cpp, tos, opc }

        // 1. MAR (Memory Address Register) - 12 bits
        if (sinaisC.mar) {
            // Como o MAR é de 12 bits, o próprio método write dele fará o "& 0x0FFF"
            registradores.mar.write(valorFinal);
        }

        // 2. MBR (Memory Buffer Register) - 16 bits
        if (sinaisC.mbr) {
            registradores.mbr.write(valorFinal);
        }

        // 3. PC (Program Counter) - 12 bits
        if (sinaisC.pc) {
            registradores.pc.write(valorFinal);
        }

        // 4. AC (Accumulator) - 16 bits
        if (sinaisC.ac) {
            registradores.ac.write(valorFinal);
        }

        // 5. SP (Stack Pointer) - 16 bits
        if (sinaisC.sp) {
            registradores.sp.write(valorFinal);
        }

        // 6. LV (Local Variable) - 16 bits
        if (sinaisC.lv && registradores.lv) {
            registradores.lv.write(valorFinal);
        }

        // 7. CPP - 16 bits
        if (sinaisC.cpp && registradores.cpp) {
            registradores.cpp.write(valorFinal);
        }

        // 8. TOS (Top of Stack) - 16 bits
        if (sinaisC.tos && registradores.tos) {
            registradores.tos.write(valorFinal);
        }

        // 9. OPC (Old Program Counter) - 16 bits
        if (sinaisC.opc && registradores.opc) {
            registradores.opc.write(valorFinal);
        }
    }
}

export default BusC;