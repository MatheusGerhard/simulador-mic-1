// Increment - Incrementador do MPC

class Increment {
    increment() {
        return (this.value + 1) & 0x1FF;
    }
}

export default Increment;