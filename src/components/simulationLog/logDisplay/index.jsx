import { useEffect, useRef, useState } from "react";
import {
    clearSimulationLog,
    getSimulationLog,
    subscribeToSimulationLog,
} from "../../../services/simulationLog";
import styles from "./styles.module.css";

function formatCycleText(cycles) {
    if (cycles === null || cycles === undefined) {
        return null;
    }

    return `${cycles} ciclo${cycles === 1 ? "" : "s"}`;
}

export default function LogDisplay() {
    const [events, setEvents] = useState(getSimulationLog());
    const endRef = useRef(null);

    useEffect(() => {
        return subscribeToSimulationLog(setEvents);
    }, []);

    useEffect(() => {
        endRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [events]);

    return (
        <div className={styles.logWindow}>
            <div className={styles.header}>
                <div className={styles.title}>Log</div>
                <button className={styles.clearButton} onClick={clearSimulationLog}>
                    Limpar
                </button>
            </div>

            <div className={styles.container}>
                {events.length === 0 ? (
                    <div className={styles.empty}>Sem eventos</div>
                ) : (
                    events.map((event) => (
                        <article className={styles.event} key={event.id}>
                            <div className={styles.eventHeader}>
                                <span className={styles.label}>{event.label}</span>
                                <time className={styles.time}>{event.timestamp}</time>
                            </div>
                            {event.metadata?.processor && (
                                <div className={styles.metrics}>
                                    <span>{event.metadata.processor}</span>
                                    {event.metadata.instructionText && (
                                        <span>{event.metadata.instructionText}</span>
                                    )}
                                    {formatCycleText(event.metadata.cycles) && (
                                        <span>{formatCycleText(event.metadata.cycles)}</span>
                                    )}
                                </div>
                            )}
                            <p className={styles.message}>{event.message}</p>
                        </article>
                    ))
                )}
                <div ref={endRef} />
            </div>
        </div>
    );
}
