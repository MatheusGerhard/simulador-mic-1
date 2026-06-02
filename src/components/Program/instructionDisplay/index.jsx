import styles from "./styles.module.css";
import Montador from "../../../../montador/montador";

export default function InstructionDisplay() {
    function handleClick() {
        let string = document.getElementById("codigo").value;

        let montador = new Montador(string);

        let result = montador.main();
        
        if (result != null) {

            if (result) {
                
                alert(result);
                return;
            }
            
        }else if(result === null){
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
                id="codigo"
                placeholder="Digite o código aqui..."
                className={styles.textarea}
            />
        </div>
    );
}
