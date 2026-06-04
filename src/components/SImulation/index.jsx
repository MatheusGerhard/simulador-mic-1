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
    pc: '0', ac: '0', sp: '0', ir: '0', tir: '0',
    

    //novos
    zero: '0', um: '0', menosUm: '0', am: '0', sm: '0',
    regA: '0', regB: '0', regC: '0', regD: '0', regE: '0', regF: '0000000000000000',
    
    decA: '0', decB: '0', decC: '0'
    
};

function COMPONENTE({ label, value, customStyle }) {
    return (
        // Passe a prop para o style da div principal
        <div className={styles.componente} style={customStyle}>
            <header className={styles.label}>
                {label}
            </header>
            <span className={styles.value}>
                {value}
            </span>
        </div>
    );
}


function BancoDeRegistradores({ estado , customStyle}) {
    const listaRegistradores = [
        { id: 'pc', label: 'PC' },
        { id: 'ac', label: 'AC' },
        { id: 'sp', label: 'SP' },
        { id: 'ir', label: 'IR' },
        { id: 'tir', label: 'TIR' },
        { id: 'zero', label: 'ZERO' },
        { id: 'um', label: 'UM' },
        { id: 'menosUm', label: '-1' },
        { id: 'am', label: 'AMASK' },
        { id: 'sm', label: 'SMASK' },
        { id: 'regA', label: 'REG A' },
        { id: 'regB', label: 'REG B' },
        { id: 'regC', label: 'REG C' },
        { id: 'regD', label: 'REG D' },
        { id: 'regE', label: 'REG E' },
        { id: 'regF', label: 'REG F' }
    ];
    return (
        <div className={styles.banco} style={customStyle}>
            <div className={styles.tituloBanco} >Banco de Registradores</div>
            
            <div className={styles.registradoresGrid}>
                {listaRegistradores.map((reg) => (
                    <div key={reg.id} className={styles.regItem}>
                        <div className={styles.regLabel}>
                            {reg.label}
                        </div>
                        <div className={styles.regValue}>
                            {estado[reg.id]}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

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

            <BancoDeRegistradores estado={estado} customStyle={{position: 'absolute', top: '5%', left: '0%'}}/>
            
          
            <COMPONENTE label="Clock" value={`Ciclos : ${estado.ciclos} |  Subciclo : ${estado.subciclo}`} customStyle={{ position: 'absolute', top: '5%', left: '80%' }} />
            <COMPONENTE label="DEC A" value={estado.decA} customStyle={{ position: 'absolute', top: '5%', left: '60%' }} />
            <COMPONENTE label="DEC B" value={estado.decB} customStyle={{ position: 'absolute', top: '15%', left: '60%' }} />
            <COMPONENTE label="DEC C" value={estado.decC} customStyle={{ position: 'absolute', top: '25%', left: '60%' }} />

            <COMPONENTE label="MIR" value={estado.mir} customStyle={{ position: 'absolute', top: '65%', left: '85%' }} />
            
            
            <COMPONENTE label="MPC" value={estado.mpc} customStyle={{ position: 'absolute', top: '30%', left: '85%'  }} />
            <COMPONENTE label="MSL" value={estado.msl} customStyle={{ position: 'absolute', top: '75%', left: '55%' }} />
            <COMPONENTE label="MMUX" value={estado.mmux} customStyle={{ position: 'absolute', top: '20%', left: '83%'  }} />
            
            <COMPONENTE label = "Control Store" value="256 x 32" customStyle={{ position: 'absolute', top: '40%', left: '85%' }}/>
            
            <COMPONENTE label="MAR" value={estado.mar} customStyle={{ position: 'absolute', top: '60%', left: '0%' }} />
            <COMPONENTE label="MBR" value={estado.mbr} customStyle={{  position: 'absolute', top: '70%', left: '0%'  }} />
            <COMPONENTE label="Latch A" value={estado.latA} customStyle={{position: 'absolute', top: '50%', left: '20%'    }} />
            <COMPONENTE label="Latch B" value={estado.latB} customStyle={{ position: 'absolute', top: '50%', left: '40%'    }} />
            <COMPONENTE label="AMUX" value={estado.amux} customStyle={{ position: 'absolute', top: '65%', left: '20%'   }} />
            <COMPONENTE label="ALU" value={`${estado.aluRes} (Z=${estado.aluZ} N=${estado.aluN})`} customStyle={{position: 'absolute', top: '75%', left: '27%'   }} />
            <COMPONENTE label="Shifter" value={estado.shifter} customStyle={{ position: 'absolute', top: '85%', left: '30%'  }} />

            
        </div>
    );
}