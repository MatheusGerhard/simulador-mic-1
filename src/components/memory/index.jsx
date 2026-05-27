import { useEffect, useState } from "react";
import memoria from "../../../processador/Memory";
import styles from './styles.module.css'

export default function Memory() {
    const [, forceUpdate] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            forceUpdate((v) => v + 10);
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.memory}>
            <div className={styles.title}>
                Memória
            </div>
            <div className={styles.container}>
                {
                    memoria.data.map((value, index) => (
                        <div key={index}>
                            <div className={styles.adress}>
                                <div className={styles.index}>
                                    {index} :
                                </div>
                                <div className={styles.value}>
                                    {value}
                                </div>
                            </div>
                            <div className={styles.division}></div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}