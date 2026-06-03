// Shifter - Deslocador (SHIFTER)

// Descrição: Pode deslocar o resultado da ULA antes de enviá-lo para MBR.


class Shifter {
    constructor() {
        this.value = "0000000000000000";
        this.mir = "00";
    }

    write(newValue, mir) {
        this.value = newValue;
        this.mir = mir;
    }

    deslocar() {
        switch (this.mir) {
            case "00":
                this.value = this.value;
                break

            case "01": // LSHIFT (Logical Shift Left 1)
                this.value = this.value.slice(1) + "0";
                break

            case "10": // SRA1 (Shift Right Arithmetic 1)
                this.value = this.value[0] + this.value.slice(0, 15);
                break

            case "11": // SLL8 (Shift Left Logical 8)
                this.value = this.value.slice(8).padEnd(16, "0");
                break

            default:
                this.value = this.value;
        }
    }

    read() {
        return this.value;
    }
}

export default Shifter;