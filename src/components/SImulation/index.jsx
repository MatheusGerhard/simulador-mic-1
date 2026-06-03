import styles from './styles.module.css'
import { useEffect, useState } from 'react'
import {uc} from '../../../mac1/teste3' // instância exportada

const estadoInicial = {
    subciclo: 1, ciclos: 0,
    mir: '-', mpc: '0',
    mar: '0', mbr: '0',
    aluRes: '0', aluZ: '0', aluN: '0',
    latA: '0', latB: '0',
    amux: '0', shifter: '0',
    mmux: '0', msl: '0',
    pc: '0', ac: '0', ir: '0', tir: '0',
};

export default function Simulation() {
    const [estado, setEstado] = useState(estadoInicial);

    useEffect(() => {
        uc.setCallback((novoEstado) => {
            setEstado(novoEstado);
        });

        return () => {
            uc.setCallback(null);
        };
    }, []);

    return (
        <div className={styles.simulation}>
            {/* 
            <header>
                <h1>Ciclos: {estado.ciclos} — Subciclo: {estado.subciclo}</h1>
            </header>

            <section>
                <h2>Controle</h2>
                <p>MIR: {estado.mir}</p>
                <p>MPC: {estado.mpc}</p>
                <p>MSL: {estado.msl}</p>
                <p>MMUX: {estado.mmux}</p>
            </section>

            <section>
                <h2>Registradores</h2>
                <p>PC:  {estado.pc}</p>
                <p>AC:  {estado.ac}</p>
                <p>IR:  {estado.ir}</p>
                <p>TIR: {estado.tir}</p>
                <p>MAR: {estado.mar}</p>
                <p>MBR: {estado.mbr}</p>
            </section>

            <section>
                <h2>Caminho de dados</h2>
                <p>Latch A: {estado.latA}</p>
                <p>Latch B: {estado.latB}</p>
                <p>AMUX:    {estado.amux}</p>
                <p>ALU:     {estado.aluRes} (Z={estado.aluZ} N={estado.aluN})</p>
                <p>Shifter: {estado.shifter}</p>
            </section>
             */}

            <div className={styles.componente1}></div>
            <div className={styles.componente2}></div>
            <div className={styles.componente3}></div>
            <div className={styles.componente4}></div>
            <div className={styles.componente5}></div>
        </div>
    );
}