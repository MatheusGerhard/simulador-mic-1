import styles from "./styles.module.css";
import Montador from "../../../../montador/montador";
import { useState } from "react";

const DEFAULT_PROGRAM = `LOCO 10\nSTOD 100\nLOCO 20\nADDD 100\nSTOD 101\nJUMP 0`;

export default function InstructionDisplay() {
    const [code, setCode] = useState(DEFAULT_PROGRAM);

    function handleClick() {
        let montador = new Montador(code);

        let result = montador.main();
        
        if (result != null) {
            if (result) {
                alert(result);
                return;
            }
        } else if (result === null) {
            alert("Erro na montagem do programa. Verifique o console para mais detalhes.");
            return;
        }
        
        montador.preencherMemoria();
    }

    return (
        <div className={styles.instructions}>
            <button className={styles.sendButton} onClick={handleClick}>
                Montar Programa
            </button>
            <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={styles.textarea}
            />
        </div>
    );
}   