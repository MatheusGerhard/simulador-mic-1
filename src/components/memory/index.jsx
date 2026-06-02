import { useState } from 'react';
import MemoryDisplay from './memoryDisplay';
import styles from './styles.module.css'   

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

    return (
        <div className={styles.memory}>
            <button className={styles.button} onClick={addMemory}>
                <h1 className={styles.buttonText}>+</h1>
            </button>
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