const PROCESSOR_NAMES = ["MAC-1", "MAC-2", "MAC-3"];
const MAX_TRACKED_INSTRUCTIONS = 120;

let nextInstructionId = 1;
let subscribers = new Set();

function createProcessorState(processor) {
    return {
        processor,
        currentInstruction: null,
        openInstruction: null,
        instructions: [],
        totalCycles: 0,
        completedInstructions: 0,
        ipc: 0,
        cacheHits: 0,
        cacheMisses: 0,
        cacheHitRate: null,
    };
}

let processorStates = new Map(
    PROCESSOR_NAMES.map((processor) => [processor, createProcessorState(processor)]),
);

function normalizeCycle(cycle) {
    const numericCycle = Number(cycle);
    return Number.isFinite(numericCycle) ? numericCycle : 0;
}

function getProcessorState(processor) {
    if (!processorStates.has(processor)) {
        processorStates.set(processor, createProcessorState(processor));
    }

    return processorStates.get(processor);
}

function calculateCacheHitRate(cacheHits, cacheMisses) {
    const totalAccesses = cacheHits + cacheMisses;
    return totalAccesses > 0 ? cacheHits / totalAccesses : null;
}

function recalculateMetrics(state) {
    state.ipc =
        state.totalCycles > 0 ? state.completedInstructions / state.totalCycles : 0;
    state.cacheHitRate = calculateCacheHitRate(state.cacheHits, state.cacheMisses);
}

function cloneInstruction(instruction) {
    if (!instruction) {
        return null;
    }

    return {
        ...instruction,
        instruction: instruction.instruction
            ? { ...instruction.instruction }
            : instruction.instruction,
    };
}

function cloneProcessorState(state) {
    return {
        ...state,
        currentInstruction: cloneInstruction(state.currentInstruction),
        openInstruction: cloneInstruction(state.openInstruction),
        instructions: state.instructions.map(cloneInstruction),
    };
}

function notifySubscribers() {
    const snapshot = getPerformanceSnapshot();
    subscribers.forEach((callback) => callback(snapshot));
}

export function subscribeToPerformanceTracker(callback) {
    subscribers.add(callback);
    callback(getPerformanceSnapshot());

    return () => {
        subscribers.delete(callback);
    };
}

export function getPerformanceSnapshot() {
    return PROCESSOR_NAMES.map((processor) =>
        cloneProcessorState(getProcessorState(processor)),
    );
}

export function resetPerformanceTracker() {
    nextInstructionId = 1;
    processorStates = new Map(
        PROCESSOR_NAMES.map((processor) => [processor, createProcessorState(processor)]),
    );
    notifySubscribers();
}

export function resetProcessorPerformance(processor) {
    processorStates.set(processor, createProcessorState(processor));
    notifySubscribers();
}

export function updateProcessorRuntime({
    processor = "MAC",
    cycle = 0,
    cacheHits = 0,
    cacheMisses = 0,
} = {}) {
    const state = getProcessorState(processor);

    state.totalCycles = Math.max(state.totalCycles, normalizeCycle(cycle));
    state.cacheHits = Number(cacheHits) || 0;
    state.cacheMisses = Number(cacheMisses) || 0;
    recalculateMetrics(state);
    notifySubscribers();
}

export function trackInstructionStart({
    processor = "MAC",
    address,
    instruction,
    instructionText,
    cycle = 0,
    cacheHits = 0,
    cacheMisses = 0,
} = {}) {
    const state = getProcessorState(processor);
    const startCycle = normalizeCycle(cycle);
    let finished = null;

    state.totalCycles = Math.max(state.totalCycles, startCycle);
    state.cacheHits = Number(cacheHits) || 0;
    state.cacheMisses = Number(cacheMisses) || 0;

    if (state.openInstruction) {
        const cycles = Math.max(0, startCycle - state.openInstruction.startCycle);
        finished = {
            ...state.openInstruction,
            endCycle: startCycle,
            cycles,
            status: "finished",
        };

        state.instructions = state.instructions.map((trackedInstruction) =>
            trackedInstruction.id === finished.id ? finished : trackedInstruction,
        );
        state.completedInstructions++;
    }

    const started = {
        id: nextInstructionId,
        processor,
        address,
        instruction: instruction ? { ...instruction } : instruction,
        instructionText,
        startCycle,
        endCycle: null,
        cycles: null,
        status: "running",
    };

    nextInstructionId++;
    state.openInstruction = started;
    state.currentInstruction = started;
    state.instructions = [...state.instructions, started].slice(-MAX_TRACKED_INSTRUCTIONS);

    recalculateMetrics(state);
    notifySubscribers();

    return {
        started: cloneInstruction(started),
        finished: cloneInstruction(finished),
        state: cloneProcessorState(state),
    };
}

export { PROCESSOR_NAMES };
