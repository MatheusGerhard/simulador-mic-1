import { useState } from 'react';
import MemoryDisplay from './memoryDisplay';
import styles from './styles.module.css'   
import memoria from '../../../processador/memory';
import clock from '../../../mac1/teste3';
import {uc} from '../../../mac1/teste3';
import {executa} from '../../../mac1/teste3';

export default function Memory() {
    const [memoryNum, setMemoryNum] = useState(1);
    

    function addMemory() {
        if(memoryNum < 4){
            setMemoryNum(current => current + 1);
        }
    }

    function deleteMemory(){
        if(memoryNum>0){
            setMemoryNum(current => current - 1);
        }
    }

    function clearMemory(){
        memoria.clearMemory();
    }

    function initProgram(){
        executa(clock, uc);
    }
    function pauseProgram(){
        clock.pausar();
    }

    return (
        <div className={styles.memory}>
            <div className={styles.container}>
                <button className={styles.button} onClick={addMemory}>
                    <h1 className={styles.buttonText}>+</h1>
                </button>
                <button className={styles.button} onClick={clearMemory }>
                    <h1 className={styles.buttonText}>/</h1>
                </button>
                <button className={styles.button} onClick={initProgram}>
                    <h1 className={styles.buttonText}>Init</h1>
                </button>
                <button className={styles.button} onClick={pauseProgram}>
                    <h1 className={styles.buttonText}>| |</h1>
                </button>
            </div>
            <div className={styles.container}>
                {Array.from({ length: memoryNum }).map((_, index) => (
                        <MemoryDisplay
                            key={index}
                            onAddMemory={addMemory}
                            close={deleteMemory}
                        />
                    ))
                }
            </div>
        </div>
    );
}