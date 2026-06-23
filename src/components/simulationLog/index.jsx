import { useState } from "react";
import LogButton from "./logButton";
import LogDisplay from "./logDisplay";
import styles from "./styles.module.css";

export default function SimulationLog() {
    const [isOpen, setIsOpen] = useState(false);

    function toggleWindow() {
        setIsOpen((current) => !current);
    }

    return (
        <div className={styles.container}>
            {isOpen && <LogDisplay />}
            <LogButton active={isOpen} onClick={toggleWindow} />
        </div>
    );
}
