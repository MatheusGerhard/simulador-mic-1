import ControlUnit1 from '../mac1/controlUnit.js';
import ControlUnit2 from '../mac2/controlUnit.js';
import ControlUnit3 from '../mac3/controlUnit.js';
import Clock from '../mac1/componentes/clock.js';



// Injeção de instruções na RAM (Opcodes: LOCO, STOD, ADDD, SUBD, JUMP)


const clock = new Clock();
const uc1 = new ControlUnit1();
const uc2 = new ControlUnit2();
const uc3 = new ControlUnit3();



// Configura PC inicial
function executa(clock, uc){


    clock.iniciar(uc);
}


export {uc1, uc2, uc3};
export default clock;
export {executa};   