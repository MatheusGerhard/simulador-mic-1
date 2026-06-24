import styles from './styles.module.css'
import { useEffect, useState } from 'react'
import { uc1, uc2, uc3 } from "../../../testes/teste3";
import ALU from './ALU';
import { useMac } from '../../context/MacContext';

const DEFAULT_CACHE_SIZE = 3;
const CONTROL_UNITS = {
    mac1: uc1,
    mac2: uc2,
    mac3: uc3,
};

function normalizeCacheSize(size) {
    const numericSize = Number.parseInt(size, 10);
    return Number.isFinite(numericSize) && numericSize >= 1
        ? numericSize
        : DEFAULT_CACHE_SIZE;
}

function readCacheSnapshot(controlUnit) {
    return controlUnit?.cache?.getSnapshot?.() ?? null;
}

function formatCacheCell(value) {
    return value === null || value === undefined || value === "" ? "-" : value;
}

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
    regA: '0', regB: '0', regC: '0', regD: '0', regE: '0', regF: '0',
    
    decA: '0', decB: '0', decC: '0'
    
};

function COMPONENTE({ label, value, className }) {
    return (
        <div
            className={`${styles.componente} ${className || ""}`}>
            <header className={styles.label}>
                {label}
            </header>
            <div className={styles.value}>
                <h1>{value}</h1>
            </div>
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
        <div className={styles.banco}>
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

function CacheContent({ snapshot }) {
    const hasCache = Array.isArray(snapshot);

    return (
        <section className={styles.cachePanel}>
            <h2>Conteudo da Cache</h2>

            {!hasCache ? (
                <div className={styles.cacheUnavailable}>Cache nao disponivel</div>
            ) : (
                <div className={styles.cacheTableWrapper}>
                    <table className={styles.cacheTable}>
                        <thead>
                            <tr>
                                <th>Linha</th>
                                <th>V</th>
                                <th>Endereco</th>
                                <th>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {snapshot.map((line) => (
                                <tr key={line.index}>
                                    <td>{line.index}</td>
                                    <td>{line.valid ? "1" : "0"}</td>
                                    <td>{formatCacheCell(line.addressRange ?? line.address)}</td>
                                    <td>{formatCacheCell(line.value)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default function Simulation() {
    const [estado, setEstado] = useState(estadoInicial);
    const [cacheSize, setCacheSize] = useState(uc2.cacheSize ?? DEFAULT_CACHE_SIZE);
    const [cacheSnapshot, setCacheSnapshot] = useState(() =>
        readCacheSnapshot(CONTROL_UNITS.mac1),
    );
    const { activeMac, setActiveMac } = useMac();

    useEffect(() => {
        const uc = CONTROL_UNITS[activeMac];

        if (!uc) return;

        setCacheSnapshot(readCacheSnapshot(uc));

        uc.setCallback((novoEstado) => {
            setEstado(novoEstado);
            setCacheSnapshot(readCacheSnapshot(uc));
        });
    }, [activeMac]);

    useEffect(() => {
        uc2.setCacheSize(cacheSize);
        uc3.setCacheSize(cacheSize);
    }, [cacheSize]);

    useEffect(() => {
        setCacheSnapshot(readCacheSnapshot(CONTROL_UNITS[activeMac]));
    }, [activeMac, cacheSize]);

    // Polling: garante que qualquer escrita no cache (inclusive manual) reflita na UI
    useEffect(() => {
        const uc = CONTROL_UNITS[activeMac];
        if (!uc) return;
        const interval = setInterval(() => {
            setCacheSnapshot(readCacheSnapshot(uc));
        }, 100);
        return () => clearInterval(interval);
    }, [activeMac]);

    return (
        <div className={styles.simBox}>
            <div className={styles.selectProcesser}>
                <button
                    onClick={() => setActiveMac("mac1")}
                    className={`${styles.botao} ${activeMac === "mac1" ? styles.ativo : ""}`}
                >
                    Mac 1
                </button>

                <button
                    onClick={() => setActiveMac("mac2")}
                    className={`${styles.botao} ${activeMac === "mac2" ? styles.ativo : ""}`}
                >
                    Mac 2
                </button>

                <button
                    onClick={() => setActiveMac("mac3")}
                    className={`${styles.botao} ${activeMac === "mac3" ? styles.ativo : ""}`}
                >
                    Mac 3
                </button>
                <label className={styles.cacheControl}>
                    <span>Cache</span>
                    <input
                        min="1"
                        step="1"
                        type="number"
                        value={cacheSize}
                        className={styles.cacheControlInput}
                        onChange={(event) =>
                            setCacheSize(normalizeCacheSize(event.target.value))
                        }
                    />
                </label>
            </div>
            <div className={styles.simulation}>

                <BancoDeRegistradores estado={estado}/>
            
                <COMPONENTE label="Clock" value={`Ciclos : ${estado.ciclos} |  Subciclo : ${estado.subciclo}`} className={styles.clock}/>
                <COMPONENTE label="DEC A" value={estado.decA} className={styles.decA} />
                <COMPONENTE label="DEC B" value={estado.decB} className={styles.decB} />
                <COMPONENTE label="DEC C" value={estado.decC} className={styles.decC} />

                <COMPONENTE label="MIR" value={estado.mir} className={styles.mir}/>
                
                <COMPONENTE label="MPC" value={estado.mpc} className={styles.mpc}/>
                <COMPONENTE label="MSL" value={estado.msl} className={styles.msl}/>
                <COMPONENTE label="MMUX" value={estado.mmux} className={styles.mmux}/>
                
                <COMPONENTE label = "Control Store" value="256 x 32" className={styles.controlStore}/>
                
                <COMPONENTE label="MAR" value={estado.mar} className={styles.mar}/>
                <COMPONENTE label="MBR" value={estado.mbr} className={styles.mbr}/>
                <COMPONENTE label="Latch A" value={estado.latA} className={styles.latchA}/>
                <COMPONENTE label="Latch B" value={estado.latB} className={styles.latchB}/>
                <COMPONENTE label="AMUX" value={estado.amux} className={styles.amux}/>
                <ALU label="ULA" value={`${estado.aluRes} (Z=${estado.aluZ} N=${estado.aluN})`} className={styles.alu}/>
                <COMPONENTE label="Shifter" value={estado.shifter} className={styles.shifter}/>

            </div>
            <CacheContent snapshot={cacheSnapshot} />
        </div>
    );
}

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