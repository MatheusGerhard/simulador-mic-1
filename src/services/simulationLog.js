import {
    resetPerformanceTracker,
    trackInstructionStart,
} from "./performanceTracker.js";

const MAX_LOG_EVENTS = 500;

const LOG_LABELS = {
    memoryWrite: "[MEMORY WRITE]",
    cacheHit: "[CACHE HIT]",
    cacheMiss: "[CACHE MISS]",
    instruction: "[INSTRUCTION]",
    instructionStarted: "[INSTRUCTION STARTED]",
    instructionFinished: "[INSTRUCTION FINISHED]",
};

const OPCODES_12_BITS = {
    "0000": "LODD",
    "0001": "STOD",
    "0010": "ADDD",
    "0011": "SUBD",
    "0100": "JPOS",
    "0101": "JZER",
    "0110": "JUMP",
    "0111": "LOCO",
    "1000": "LODL",
    "1001": "STOL",
    "1010": "ADDL",
    "1011": "SUBL",
    "1100": "JNEG",
    "1101": "JNZE",
    "1110": "CALL",
};

const OPCODES_FIXED = {
    "11110000": "PSHI",
    "11110010": "POPI",
    "11110100": "PUSH",
    "11110110": "POP",
    "11111000": "RETN",
    "11111010": "SWAP",
};

const OPCODES_8_BITS = {
    "11111100": "INSP",
    "11111110": "DESP",
};

let events = [];
let nextId = 1;
let subscribers = new Set();
let instructionCatalog = new Map();
let lastInstructionLogKey = null;

function normalizeBinaryWord(value) {
    return String(value ?? "").padStart(16, "0").slice(-16);
}

function normalizeAddress(address) {
    if (typeof address === "number") {
        return address;
    }

    const value = String(address ?? "");

    if (/^[01]+$/.test(value)) {
        return parseInt(value, 2);
    }

    const decimal = Number(value);
    return Number.isNaN(decimal) ? value : decimal;
}

function formatInstruction(instruction) {
    if (!instruction || !instruction.opcode) {
        return null;
    }

    if (instruction.operando === null || instruction.operando === undefined) {
        return instruction.opcode;
    }

    return `${instruction.opcode} ${instruction.operando}`;
}

function decodeInstructionWord(word) {
    const binaryWord = normalizeBinaryWord(word);
    const opcode4 = binaryWord.slice(0, 4);
    const opcode8 = binaryWord.slice(0, 8);

    if (OPCODES_12_BITS[opcode4]) {
        return {
            opcode: OPCODES_12_BITS[opcode4],
            operando: parseInt(binaryWord.slice(4), 2),
        };
    }

    if (OPCODES_FIXED[opcode8]) {
        return {
            opcode: OPCODES_FIXED[opcode8],
            operando: null,
        };
    }

    if (OPCODES_8_BITS[opcode8]) {
        return {
            opcode: OPCODES_8_BITS[opcode8],
            operando: parseInt(binaryWord.slice(8), 2),
        };
    }

    return null;
}

function notifySubscribers() {
    const snapshot = [...events];
    subscribers.forEach((callback) => callback(snapshot));
}

function addLogEvent(type, message, metadata = {}) {
    const event = {
        id: nextId,
        label: LOG_LABELS[type] ?? "[LOG]",
        message,
        type,
        metadata,
        timestamp: new Date().toLocaleTimeString("pt-BR", {
            hour12: false,
        }),
    };

    nextId++;
    events = [...events, event].slice(-MAX_LOG_EVENTS);
    notifySubscribers();
}

export function subscribeToSimulationLog(callback) {
    subscribers.add(callback);
    callback([...events]);

    return () => {
        subscribers.delete(callback);
    };
}

export function getSimulationLog() {
    return [...events];
}

export function clearSimulationLog() {
    events = [];
    lastInstructionLogKey = null;
    resetPerformanceTracker();
    notifySubscribers();
}

export function registerMacroInstructions(macroinstrucoes) {
    instructionCatalog = new Map();

    macroinstrucoes
        .filter((instruction) => instruction.opcode !== null)
        .forEach((instruction) => {
            instructionCatalog.set(Number(instruction.rotulo_index), {
                opcode: instruction.opcode,
                operando: instruction.operando,
            });
        });
}

export function clearMacroInstructionCatalog() {
    instructionCatalog = new Map();
    lastInstructionLogKey = null;
    resetPerformanceTracker();
}

export function logMemoryWrite(address, previousValue, nextValue) {
    const normalizedAddress = normalizeAddress(address);
    addLogEvent(
        "memoryWrite",
        `Endereço ${normalizedAddress} alterado de ${previousValue} para ${nextValue}`,
        {
            address: normalizedAddress,
            previousValue,
            nextValue,
        },
    );
}

export function logCacheHit(address) {
    const normalizedAddress = normalizeAddress(address);
    addLogEvent("cacheHit", `Endereço ${normalizedAddress}`, {
        address: normalizedAddress,
    });
}

export function logCacheMiss(address) {
    const normalizedAddress = normalizeAddress(address);
    addLogEvent("cacheMiss", `Endereço ${normalizedAddress}`, {
        address: normalizedAddress,
    });
}

export function logInstructionExecution(address, options = {}) {
    const normalizedAddress = normalizeAddress(address);
    const word = options.word;
    const instruction =
        options.instruction ??
        instructionCatalog.get(Number(normalizedAddress)) ??
        (word ? decodeInstructionWord(word) : null);
    const instructionText = formatInstruction(instruction);

    if (!instructionText) {
        return;
    }

    const processor = options.processor ?? "MAC";
    const logKey = `${processor}:${options.executionKey ?? ""}:${normalizedAddress}:${instructionText}`;

    if (logKey === lastInstructionLogKey) {
        return;
    }

    lastInstructionLogKey = logKey;
    const telemetry = trackInstructionStart({
        processor,
        address: normalizedAddress,
        instruction,
        instructionText,
        cycle: options.cycle,
        cacheHits: options.cacheHits,
        cacheMisses: options.cacheMisses,
    });

    if (telemetry.finished) {
        addLogEvent(
            "instructionFinished",
            `${telemetry.finished.instructionText} concluida em ${telemetry.finished.cycles} ciclo(s)`,
            {
                address: telemetry.finished.address,
                processor,
                instruction: telemetry.finished.instruction,
                instructionText: telemetry.finished.instructionText,
                startCycle: telemetry.finished.startCycle,
                endCycle: telemetry.finished.endCycle,
                cycles: telemetry.finished.cycles,
            },
        );
    }

    addLogEvent(
        "instructionStarted",
        `Executando ${instructionText}`,
        {
            address: normalizedAddress,
            processor,
            instruction,
            instructionText,
            startCycle: telemetry.started.startCycle,
        },
    );
}
