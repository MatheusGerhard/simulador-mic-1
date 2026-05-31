import { useState } from 'react';
import MemoryDisplay from './memoryDisplay';
import MemoryButton from './memoryButton';
import styles from './styles.module.css'   

export default function Memory() {
    const [isOpen, setIsOpen] = useState(false);
    const [memoryNum, setMemoryNum] = useState(1);

    function toggleMemory() {
        setIsOpen(current => !current);
        if(isOpen){
            setMemoryNum(1);
        }
    }

    function addMemory() {
        if(memoryNum < 3){
            setMemoryNum(current => current + 1);
        }
    }

    return (
        <div className={styles.container}>
            {isOpen &&
                Array.from({ length: memoryNum }).map((_, index) => (
                    <MemoryDisplay
                        key={index}
                        onAddMemory={addMemory}
                    />
                ))
            }

            <MemoryButton onClick={toggleMemory} />
        </div>
    );
}