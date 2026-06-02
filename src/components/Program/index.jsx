import { useState } from 'react';
import styles from './styles.module.css'   
import InstructionButton from './instructionButton';
import InstructionDisplay from './instructionDisplay';

export default function Program() {
    const [isOpen, setIsOpen] = useState(false);

    function toggleWindow() {
        setIsOpen(current => !current);
    }

    return (
        <div className={styles.container}>
            {isOpen && <InstructionDisplay/>}
            <InstructionButton onClick={toggleWindow} />
        </div>
    );
}