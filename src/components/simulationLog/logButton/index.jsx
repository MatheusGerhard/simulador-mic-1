import styles from "./styles.module.css";

export default function LogButton({ active, onClick }) {
    return (
        <button
            className={`${styles.logButton} ${active ? styles.active : ""}`}
            onClick={onClick}
        >
            <span className={styles.text}>Log</span>
        </button>
    );
}
