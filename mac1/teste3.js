import ControlUnit from './controlUnit.js';
import Clock from './componentes/clock.js';



// Injeção de instruções na RAM (Opcodes: LOCO, STOD, ADDD, SUBD, JUMP)


const clock = new Clock();
const uc = new ControlUnit();



// Configura PC inicial
function executa(clock, uc){


    clock.iniciar(uc);
}


export {uc};
export default clock;
export {executa};   