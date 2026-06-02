// Increment - Incrementador do MPC

class Increment {
    constructor() {
        this.value = 0;
    }

    // Recebe microinstrução do mpc
    write(newValue) {
        this.value = newValue;
    }

    // Incrementa 1
    increment() {
        this.value += 1;
    }

    // Envia para MMUX
    read() {
        return this.value;
    }

    clear() {
        this.value = 0;
    }
}

export default Increment;