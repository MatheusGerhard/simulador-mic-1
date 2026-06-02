import styles from "./styles.module.css";
import Montador from "../../../../montador/montador";

export default function InstructionDisplay() {
    function handleClick() {
        let string = document.getElementById("codigo").value;

        let montador = new Montador(string);

        montador.main();
        montador.preencherMemoria();
        console.log(montador.macroinstrucoes);
    }
    return (
        <div className={styles.instructions}>
            <button className={styles.sendButton} onClick={handleClick}>
                Montar Programa
            </button>
            <textarea
                id="codigo"
                placeholder="Digite o código aqui..."
                className={styles.textarea}
            />
        </div>
    );
}
