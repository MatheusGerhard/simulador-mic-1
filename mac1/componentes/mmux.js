// Mmux - Multiplexador de Microprograma

// Descrição: Recebe o dado do mpc e addr, e envia o correto ao mpc 

class Mmux {
    select(incrementedAddr, jumpAddr, controlSignal) {
        if (controlSignal) {
            return jumpAddr;
        }
        return incrementedAddr;
    }
}

export default Mmux;
