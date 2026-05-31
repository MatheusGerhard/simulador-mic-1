// Increment - Incrementador do MPC

class Increment {
    calculate(currentMpc) {
        const nextValue = (currentMpc + 1) & 0x1FF;
        return nextValue;
    }
}

export default Increment;