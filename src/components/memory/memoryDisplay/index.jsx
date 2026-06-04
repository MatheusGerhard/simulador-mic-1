import { useEffect, useRef, useState } from "react";
import memoria from "../../../../processador/memory";
import styles from './styles.module.css';

export default function MemoryDisplay({ id, close }) {
    const [data, setData] = useState(memoria.data);
    const [visibleLines, setVisibleLines] = useState(100);
    const [isBinary, setIsBinary] = useState(true);
    const [isSettingOpen, setIsSettingOpen] = useState(false);
    const [line, setLine] = useState(0);
    const lineRefs = useRef([]);

    useEffect(() => {
    const interval = setInterval(() => {
        setData([...memoria.data]); // cópia nova do array a cada 100ms
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
        }else{
            let numerico = parseInt(binaryValue, 2);
            if(binaryValue[0] === '1'){
                numerico = numerico - 2*32768;
                
            }
            return numerico;
        }

        
    }

    function openSetting(){
        setIsSettingOpen(current => !current);
    }

    function searchLine() {
        const lineNumber = Number(line);

        if (Number.isNaN(lineNumber) || lineNumber < 0 || lineNumber >= data.length) {
            return;
        }

        setVisibleLines(Math.max(visibleLines, lineNumber + 1));

        setTimeout(() => {
            lineRefs.current[lineNumber]?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }, 0);
    }

    return (
        <div className={styles.memory}>
            <div className={styles.header}>
                <button className={styles.button} onClick={() => close(id)}>
                    <h1 className={styles.buttonText}>×</h1>
                </button>
                <div className={styles.title}>
                    Memória
                </div>
                <div className={styles.headerButtons}>
                    <button className={styles.button} onClick={changeBase}>
                        <svg width="22" height="22" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M23.3333 0C10.4467 0 0 10.4467 0 23.3333C0 36.2199 10.4467 46.6667 23.3333 46.6667C36.2199 46.6667 46.6667 36.2199 46.6667 23.3333H42C42 33.6427 33.6427 42 23.3333 42C13.024 42 4.66667 33.6427 4.66667 23.3333C4.66667 13.024 13.024 4.66667 23.3333 4.66667C29.0824 4.66667 34.2244 7.2656 37.6486 11.3527L32.9896 16.0105C31.9657 15.1215 30.629 14.5833 29.1667 14.5833C25.945 14.5833 23.3333 17.195 23.3333 20.4167V26.25C23.3333 29.4716 25.945 32.0833 29.1667 32.0833C32.3883 32.0833 35 29.4716 35 26.25V20.4167C35 18.8267 34.3639 17.3855 33.3326 16.3333H46.6667V2.33333L40.9579 8.04179C36.68 3.11521 30.3704 0 23.3333 0ZM31.5 20.4167V26.25C31.5 27.5387 30.4554 28.5833 29.1667 28.5833C27.878 28.5833 26.8333 27.5387 26.8333 26.25V20.4167C26.8333 19.128 27.878 18.0833 29.1667 18.0833C30.4554 18.0833 31.5 19.128 31.5 20.4167ZM18.6667 15.1667H15.1667V31.5H18.6667V15.1667Z" fill="#ffffff"/>
                        </svg>
                    </button>
                    <button className={styles.button} onClick={openSetting}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 13.2L16.6 8.6L18 10L12 16L6 10L7.4 8.6L12 13.2Z" fill="#ffffff"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div className={styles.container}>
                {
                    data.slice(0, visibleLines).map((value, index) => (
                        <div key={index} ref={(element) => lineRefs.current[index] = element}>
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
            {isSettingOpen && <div className={styles.settings}>
                <input
                    className={styles.searchLine}
                    type="number"
                    min="0"
                    max={data.length - 1}
                    value={line}
                    onChange={(e) => setLine(e.target.value)}
                />
                <button className={styles.searchButton} onClick={searchLine}>Buscar</button>
            </div>}
        </div>
    );
}