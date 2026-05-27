import { useEffect, useState } from "react";
import memoria from "../../../processador/Memory";

export default function Memory() {
    const [, forceUpdate] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            forceUpdate((v) => v + 10);
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {
                memoria.data.map((value, index) => (
                    <div key={index}>
                        {index}: {value}
                    </div>
                ))
            }
        </>
    );
}