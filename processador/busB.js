// Bus B - Barramento B

// Descrição: Via de comunicação compartilhada para transporte de dados, endereços e sinais.
// Recebe: Dados de um componente de origem (ex: Saída da ALU ou Memória).
// Envia: Os mesmos dados para o componente de destino selecionado (ex: Registrador AC).

// Bus B / Barramento B
// Descrição: Multiplexador que seleciona um registrador para alimentar a entrada direita da ULA.
// Controle: Recebe um sinal de 4 bits (geralmente chamado de 'bbus') da microinstrução.

class BusB {
    // Passamos todas as peças do hardware para o barramento poder ler seus valores
    selecionar(codigoBusB, registradores) {
        // registradores é um objeto contendo as instâncias de { mdc, pc, mbr, ac, sp, lv, cpp, tos, opc }
        
        switch (codigoBusB) {
            case 0: // 0000: MDR (Memory Data Register)
                // Detalhe: Como a memória dos seus amigos usa string binária,
                // convertemos para número para a ULA poder calcular.
                return parseInt(registradores.mbr.read(), 2) || 0;

            case 1: // 0001: PC (Program Counter)
                return registradores.pc.read();

            case 2: // 0010: MBR (Memory Buffer Register - com extensão de sinal, mas no Mic-1 simplificado lemos direto)
                // Tratando o MBR caso ele seja lido como dado puro por outro caminho
                return parseInt(registradores.mbr.read(), 2) || 0;

            case 3: // 0011: AC (Accumulator)
                return registradores.ac.read();

            case 4: // 0100: SP (Stack Pointer)
                return registradores.sp.read();

            case 5: // 0101: LV (Local Variable)
                return registradores.lv ? registradores.lv.read() : 0;

            case 6: // 0110: CPP
                return registradores.cpp ? registradores.cpp.read() : 0;

            case 7: // 0111: TOS (Top of Stack)
                return registradores.tos ? registradores.tos.read() : 0;

            case 8: // 1000: OPC (Old Program Counter)
                return registradores.opc ? registradores.opc.read() : 0;

            default:
                // Se o código for maior que 8 ou não mapeado, nenhum registrador joga dados no barramento (fica em 0)
                return 0;
        }
    }
}

export default BusB;