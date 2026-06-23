import styles from "./styles.module.css";

function formatCycles(cycles) {
    if (cycles === null || cycles === undefined) {
        return "em curso";
    }

    return `${cycles} ciclo${cycles === 1 ? "" : "s"}`;
}

function formatIpc(ipc) {
    return Number(ipc || 0).toFixed(2);
}

function formatCache(state) {
    const hits = Number(state.cacheHits || 0);
    const misses = Number(state.cacheMisses || 0);
    const total = hits + misses;

    if (total === 0) {
        return "0 / 0";
    }

    return `${hits} / ${total} (${Math.round((hits / total) * 100)}%)`;
}

function formatCacheCell(value) {
    return value === null || value === undefined || value === "" ? "-" : value;
}

function Metric({ label, value }) {
    return (
        <div className={styles.metric}>
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    );
}

function CacheContent({ hasCache, snapshot = [] }) {
    return (
        <section className={styles.cachePanel}>
            <h3>Conteudo da Cache</h3>

            {!hasCache ? (
                <div className={styles.cacheUnavailable}>Cache nao disponivel</div>
            ) : (
                <div className={styles.cacheTableWrapper}>
                    <table className={styles.cacheTable}>
                        <thead>
                            <tr>
                                <th>Linha</th>
                                <th>Endereco</th>
                                <th>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {snapshot.map((line) => (
                                <tr key={line.index}>
                                    <td>{line.index}</td>
                                    <td>{formatCacheCell(line.addressRange ?? line.address)}</td>
                                    <td>{formatCacheCell(line.value)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default function ProcessorTrack({ accent, cacheSnapshot, hasCache, state }) {
    const currentInstruction =
        state.currentInstruction?.instructionText ?? "Aguardando";

    return (
        <section className={styles.processorLane} style={{ "--lane-accent": accent }}>
            <header className={styles.laneHeader}>
                <div>
                    <h2>{state.processor}</h2>
                    <p>{currentInstruction}</p>
                </div>
                <div className={styles.metricGrid}>
                    <Metric label="Ciclos" value={state.totalCycles} />
                    <Metric label="CPI" value={formatIpc(state.ipc)} />
                    {hasCache && <Metric label="Cache" value={formatCache(state)} />}
                </div>
            </header>

            <div className={styles.trackScroller}>
                <div className={styles.track}>
                    {state.instructions.length === 0 ? (
                        <div className={styles.emptyNode}>Sem execucao</div>
                    ) : (
                        state.instructions.map((instruction) => (
                            <div
                                className={`${styles.instructionNode} ${
                                    instruction.status === "running" ? styles.runningNode : ""
                                }`}
                                key={`${state.processor}-${instruction.id}`}
                            >
                                <strong>{instruction.instructionText}</strong>
                                <span>{formatCycles(instruction.cycles)}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <CacheContent hasCache={hasCache} snapshot={cacheSnapshot} />
        </section>
    );
}
