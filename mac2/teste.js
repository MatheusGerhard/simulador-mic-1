import ControlUnit from './controlUnit.js';
import Clock from '../mac1/componentes/clock.js';
import memoria from "../mac1/componentes/memory.js";


const clock = new Clock();
const uc = new ControlUnit();

// 1. Criamos um pequeno programa em código de máquina (Opcode + Operando)
// LOCO 5  (0111 000000000101) -> Carrega 5 no AC
// STOD 50 (0001 000000110010) -> Armazena AC no endereço 50
// LOCO 10 (0111 000000001010) -> Carrega 10 no AC
// ADDD 50 (0010 000000110010) -> Soma o valor do endereço 50 (5) ao AC (10)

memoria.writeMontador(0, "0111000000000101"); 
memoria.writeMontador(1, "0001000000110010");
memoria.writeMontador(2, "0111000000001010");
memoria.writeMontador(3, "0010000000110010");

console.log("Iniciando teste do MAC-2 (5 + 10)..."+uc.mpc.read());

// 3. Ajustamos a velocidade e iniciamos
clock.setVelocidade(50); // 50ms por subciclo para facilitar a leitura
clock.iniciar(uc);

uc.setCallback((estado) => {
    if (estado.ciclos === 24 && estado.subciclo === 4) {
        clock.pausar();
        console.log("Simulação finalizada.");
        console.log("Valor final no AC (esperado 15):", parseInt(estado.ac, 2));
    }
});