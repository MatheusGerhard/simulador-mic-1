import ControlUnit1 from "../mac1/controlUnit.js";
import ControlUnit2 from "../mac2/controlUnit.js";
import { Memory } from "../mac1/componentes/memory.js";

const WORD_MASK = 0xffff;

function bin(value) {
    return (value & WORD_MASK).toString(2).padStart(16, "0");
}

function opcode4(opcode, operand = 0) {
    return opcode + (operand & 0x0fff).toString(2).padStart(12, "0");
}

function opcode8(opcode, operand = 0) {
    return opcode + (operand & 0xff).toString(2).padStart(8, "0");
}

function makeMemory(program, data = {}) {
    const memory = new Memory();
    memory.clearMemory();

    program.forEach((word, index) => {
        memory.writeMontador(index, word);
    });

    Object.entries(data).forEach(([address, value]) => {
        memory.writeMontador(Number(address), bin(value));
    });

    return memory;
}

function bindMemory(controlUnit, memory) {
    controlUnit.ram = memory;

    if (controlUnit.cache) {
        controlUnit.cache.ram = memory;
    }
}

function step(controlUnit, state) {
    const shouldContinue = controlUnit.rodarCiclo(state.subCycle, state.cycles);

    if (shouldContinue === false) {
        state.stalls++;
        state.cycles++;
        return false;
    }

    if (state.subCycle === 4 && controlUnit.mpc.read() === 0) {
        state.completedInstructions++;
    }

    state.subCycle++;

    if (state.subCycle > 4) {
        state.subCycle = 1;
        state.cycles++;
    }

    return true;
}

function run(ControlUnit, program, data, dynamicInstructionLimit, cacheSize = 3, maxSteps = 5000) {
    const previousLog = console.log;
    const previousError = console.error;
    console.log = () => {};
    console.error = () => {};

    const memory = makeMemory(program, data);
    const controlUnit = new ControlUnit(cacheSize);
    bindMemory(controlUnit, memory);

    const state = {
        subCycle: 1,
        cycles: 0,
        stalls: 0,
        completedInstructions: 0,
    };

    try {
        for (let i = 0; i < maxSteps; i++) {
            step(controlUnit, state);

            if (state.completedInstructions >= dynamicInstructionLimit) {
                while (controlUnit.ramE > 0) {
                    step(controlUnit, state);
                }

                return snapshot(controlUnit, memory, state);
            }
        }
    } finally {
        console.log = previousLog;
        console.error = previousError;
    }

    throw new Error(
        `Execution did not finish after ${maxSteps} micro steps; completed ${state.completedInstructions}`,
    );
}

function snapshot(controlUnit, memory, state) {
    return {
        pc: controlUnit.regs.read(0),
        ac: controlUnit.regs.read(1),
        sp: controlUnit.regs.read(2),
        ir: controlUnit.regs.read(3),
        tir: controlUnit.regs.read(4),
        regA: controlUnit.regs.read(10),
        regB: controlUnit.regs.read(11),
        mpc: controlUnit.mpc.read(),
        mar: controlUnit.mar.read(),
        mbr: controlUnit.mbr.read(),
        memory: [...memory.data],
        cycles: state.cycles,
        stalls: state.stalls,
        hits: controlUnit.hits ?? 0,
        misses: controlUnit.misses ?? 0,
    };
}

function relevantMemory(snapshot, addresses) {
    return Object.fromEntries(addresses.map((address) => [address, snapshot.memory[address]]));
}

function assertEquivalent(name, mac1, mac2, memoryAddresses = []) {
    const fields = ["pc", "ac", "sp", "ir", "tir", "regA", "regB"];
    const differences = [];

    for (const field of fields) {
        if (mac1[field] !== mac2[field]) {
            differences.push(`${field}: MAC-1=${mac1[field]} MAC-2=${mac2[field]}`);
        }
    }

    for (const address of memoryAddresses) {
        if (mac1.memory[address] !== mac2.memory[address]) {
            differences.push(
                `mem[${address}]: MAC-1=${mac1.memory[address]} MAC-2=${mac2.memory[address]}`,
            );
        }
    }

    if (differences.length > 0) {
        throw new Error(`${name}\n${differences.join("\n")}`);
    }
}

const tests = [
    {
        name: "direct arithmetic",
        program: [
            opcode4("0111", 5),
            opcode4("0001", 100),
            opcode4("0111", 20),
            opcode4("0010", 100),
            opcode4("0011", 100),
        ],
        instructions: 5,
        memory: [100],
    },
    {
        name: "conditional jumps",
        program: [
            opcode4("0111", 0),
            opcode4("0101", 4),
            opcode4("0111", 99),
            opcode4("0110", 5),
            opcode4("0111", 7),
            opcode4("0011", 20),
            opcode4("1100", 8),
            opcode4("0111", 99),
            opcode4("1101", 10),
            opcode4("0111", 99),
            opcode4("0001", 101),
        ],
        data: {20: 9},
        instructions: 8,
        memory: [101],
    },
    {
        name: "branch not taken and jpos",
        program: [
            opcode4("0111", 1),
            opcode4("1100", 4),
            opcode4("0100", 5),
            opcode4("0111", 99),
            opcode4("0111", 88),
            opcode4("0111", 0),
            opcode4("1101", 9),
            opcode4("0101", 10),
            opcode4("0111", 77),
            opcode4("0111", 66),
            opcode4("0001", 130),
        ],
        instructions: 7,
        memory: [130],
    },
    {
        name: "call and return",
        program: [
            opcode4("1110", 4),
            opcode4("0000", 120),
            opcode4("0110", 7),
            opcode4("0111", 99),
            opcode4("0111", 33),
            opcode4("0001", 120),
            "1111100000000000",
            opcode4("0001", 121),
        ],
        instructions: 7,
        memory: [120, 121, 0xffff],
    },
    {
        name: "local memory",
        program: [
            opcode8("11111110", 2),
            opcode4("0111", 10),
            opcode4("1001", 0),
            opcode4("0111", 20),
            opcode4("1001", 1),
            opcode4("1000", 0),
            opcode4("1010", 1),
            opcode4("1011", 0),
            opcode8("11111100", 2),
        ],
        instructions: 9,
        memory: [4094, 4095],
    },
    {
        name: "stack and indirect",
        program: [
            opcode4("0111", 10),
            "1111010000000000",
            opcode4("0111", 0x0fff),
            "1111000000000000",
            opcode4("0111", 0x0ffc),
            "1111001000000000",
            "1111011000000000",
            "1111101000000000",
        ],
        instructions: 8,
        memory: [0x0ffc, 0x0ffe, 0x0fff],
    },
];

for (const test of tests) {
    const mac1 = run(ControlUnit1, test.program, test.data ?? {}, test.instructions);
    const mac2 = run(ControlUnit2, test.program, test.data ?? {}, test.instructions);
    const mac2SmallCache = run(
        ControlUnit2,
        test.program,
        test.data ?? {},
        test.instructions,
        1,
    );
    assertEquivalent(test.name, mac1, mac2, test.memory ?? []);
    assertEquivalent(`${test.name} with cache size 1`, mac2, mac2SmallCache, test.memory ?? []);
    console.log(
        `OK ${test.name}: AC=${mac2.ac} SP=${mac2.sp} memory=${JSON.stringify(
            relevantMemory(mac2, test.memory ?? []),
        )} hits=${mac2.hits} misses=${mac2.misses} smallCacheMisses=${mac2SmallCache.misses}`,
    );
}
