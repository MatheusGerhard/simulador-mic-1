import { useEffect, useState } from "react";
import memoria from "../../../../processador/memory";
import styles from './styles.module.css';

export default function MemoryDisplay({ onAddMemory }) {
    const [, forceUpdate] = useState(0);
    const [visibleLines, setVisibleLines] = useState(100);
    const [isBinary, setIsBinary] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            forceUpdate((v) => v + 10);
        }, 100);

        return () => clearInterval(interval);
    }, []);

    function changeBase() {
        setIsBinary(current => !current);
    }

    function formatValue(value) {
        const binaryValue = String(value).padStart(16, '0').slice(-16);

        if (isBinary) {
            return binaryValue;
        }

        return parseInt(binaryValue, 2);
    }

    return (
        <div className={styles.memory}>
            <div className={styles.header}>
                <button className={styles.button} onClick={onAddMemory}>
                    <h1 className={styles.buttonText}>+</h1>
                </button>
                <div className={styles.title}>
                    Memória
                </div>
                <div className={styles.button} onClick={changeBase}>
                    <svg width="27" height="27" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.3333 0C10.4467 0 0 10.4467 0 23.3333C0 36.2199 10.4467 46.6667 23.3333 46.6667C36.2199 46.6667 46.6667 36.2199 46.6667 23.3333H42C42 33.6427 33.6427 42 23.3333 42C13.024 42 4.66667 33.6427 4.66667 23.3333C4.66667 13.024 13.024 4.66667 23.3333 4.66667C29.0824 4.66667 34.2244 7.2656 37.6486 11.3527L32.9896 16.0105C31.9657 15.1215 30.629 14.5833 29.1667 14.5833C25.945 14.5833 23.3333 17.195 23.3333 20.4167V26.25C23.3333 29.4716 25.945 32.0833 29.1667 32.0833C32.3883 32.0833 35 29.4716 35 26.25V20.4167C35 18.8267 34.3639 17.3855 33.3326 16.3333H46.6667V2.33333L40.9579 8.04179C36.68 3.11521 30.3704 0 23.3333 0ZM31.5 20.4167V26.25C31.5 27.5387 30.4554 28.5833 29.1667 28.5833C27.878 28.5833 26.8333 27.5387 26.8333 26.25V20.4167C26.8333 19.128 27.878 18.0833 29.1667 18.0833C30.4554 18.0833 31.5 19.128 31.5 20.4167ZM18.6667 15.1667H15.1667V31.5H18.6667V15.1667Z" fill="#ffffff"/>
                    </svg>

                </div>
            </div>
            <div className={styles.container}>
                {
                    memoria.data.slice(0, visibleLines).map((value, index) => (
                        <div key={index}>
                            <div className={styles.adress}>
                                <div className={styles.index}>
                                    {index} :
                                </div>
                                <div className={styles.value}>
                                    {formatValue(value)}
                                </div>
                            </div>
                            <div className={styles.division}></div>
                        </div>
                    ))
                }
                <button className={styles.loadMore} onClick={() => setVisibleLines(prev => prev + 100)}>
                    <h1 className={styles.text}> + </h1>
                </button>
            </div>
        </div>
    );
}