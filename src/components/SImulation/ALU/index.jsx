import styles from './styles.module.css'

export default function ALU({ label, value, className }) {
    return (
        <div className={`${styles.aluContainer} ${className || ""}`}>
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 120 70"
                    preserveAspectRatio="xMidYMid meet"
                >
                <polygon
                    points="10,10 42,10 50,30 70,30 78,10 110,10 95,60 25,60"
                    fill="rgb(240, 248, 255)"
                    stroke="var(--gray-900)"
                    strokeWidth="0.75"
                />
            </svg>

            <div className={styles.content}>
                <header className={styles.label}>
                    {label}
                </header>

                <div className={styles.value}>
                    <h1>{value}</h1>
                </div>
            </div>
        </div>
    );
}