import styles from './styles.module.css'

export default function InstructionButton({ onClick }){
    return(
        <button className={styles.instructionsButton} onClick={onClick}>
            <h1 className={styles.text}>Instruções</h1>
        </button>
    )
}