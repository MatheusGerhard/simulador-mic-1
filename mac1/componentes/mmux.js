// Mmux - Multiplexador de Microprograma

// Descrição: Recebe o dado do mpc e addr, e envia o correto ao mpc 

class Mmux {
    select(incrementedAddr, jumpAddr, mirSignal) {
        if (mirSignal == "1") {
            return toParseInt(jumpAddr, 2);
        }
        return incrementedAddr;
    }
}

export default Mmux;
