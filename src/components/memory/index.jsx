import { useState } from "react";
import MemoryDisplay from "./memoryDisplay";
import styles from "./styles.module.css";
import memoria from "../../../mac1/componentes/memory";
import clock from "../../../testes/teste3";
import { uc1, uc2, uc3 } from "../../../testes/teste3";
import { executa } from "../../../testes/teste3";
import { useMac } from "../../context/MacContext";

export default function Memory() {
    const { activeMac } = useMac();
    const ucs = {
        mac1: uc1,
        mac2: uc2,
        mac3: uc3,
    };
    const ucAtual = ucs[activeMac];

    const [memoryNum, setMemoryNum] = useState([1, 0, 0]);
    const [isRunning, setIsRunning] = useState(false);

    function addMemory(pos) {
        setMemoryNum((current) => {
            const newMemory = [...current];
            newMemory[pos] = 1;
            return newMemory;
        });
    }

    function deleteMemory(pos) {
        setMemoryNum((current) => {
            const newMemory = [...current];
            newMemory[pos] = 0;
            return newMemory;
        });
    }


 
    function resetComponents(){
        clock.resetClock();
        ucAtual.reset();

    }


    function clearMemory() {
        memoria.clearMemory();
        resetComponents();
        setIsRunning(false);
    }

    function initProgram() {
        executa(clock, ucAtual);
        setIsRunning(true);
    }
    function pauseProgram() {
        clock.pausar();
        setIsRunning(false);
    }

    return (
        <div className={styles.memory}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Memória</h1>
                </div>
                <div className={styles.division}></div>
                <div className={styles.container}>
                    <button className={styles.button} onClick={clearMemory}>
                        <h1 className={styles.buttonText}>Clear</h1>
                    </button>
                    <button className={`${styles.button} ${isRunning ? styles.buttonActive : ""}`}onClick={initProgram}>
                        <h1 className={styles.buttonText}>►</h1>
                    </button>
                    <button className={styles.button} onClick={pauseProgram}>
                        <h1 className={styles.buttonText}>||</h1>
                    </button>
                    <input placeholder="Tempo (ms)" type="number" min="0" className={styles.timeInput} id="time"></input>
                    <button className={styles.button} onClick={() => clock.setVelocidade(document.getElementById("time").value)}>
                        <h1 className={styles.buttonText}>Set Clock</h1>
                    </button>
                </div>
                <div className={styles.division}></div>
                <div className={styles.container}>
                    <div className={styles.slot}>
                        {memoryNum[0] ? (
                            <MemoryDisplay
                                close={deleteMemory}
                                id={0}
                            />
                        ) : (
                            <button className={styles.addButton} onClick={() => addMemory(0)}>
                                <h1 className={styles.buttonText}>+</h1>
                            </button>
                        )}
                    </div>
                    <div className={styles.slot}>
                        {memoryNum[1] ? (
                            <MemoryDisplay
                                close={deleteMemory}
                                id={1}
                            />
                        ) : (
                            <button className={styles.addButton} onClick={() => addMemory(1)}>
                                <h1 className={styles.buttonText}>+</h1>
                            </button>
                        )}
                    </div>
                    <div className={styles.slot}>
                        {memoryNum[2] ? (
                            <MemoryDisplay
                                close={deleteMemory}
                                id={2}
                            />
                        ) : (
                            <button className={styles.addButton} onClick={() => addMemory(2)}>
                                <h1 className={styles.buttonText}>+</h1>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
{
    /* {Array.from({ length: memoryNum }).map((_, index) => (
                        <MemoryDisplay
                            key={index}
                            onAddMemory={addMemory}
                            close={deleteMemory}
                        />
                    ))
                } */
}
