import styles from './styles.module.css'

export default function MemoryButton({ onClick }){
    return(
        <button className={styles.memoryButton} onClick={onClick}>
            <h1 className={styles.text}>Memória</h1>
        </button>
    )
}